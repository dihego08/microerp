<?php

namespace MicroErp\Application;

use MicroErp\Infrastructure\Persistence\MysqlDatabase;
use PDO;

final class CommercialService
{
    private PDO $pdo;

    public function __construct(MysqlDatabase $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function quotes(): array
    {
        $products = $this->pdo->query("SELECT * FROM products")->fetchAll();
        $customers = $this->pdo->query("SELECT * FROM customers")->fetchAll();
        $quotes = $this->pdo->query("SELECT * FROM quotes ORDER BY id DESC")->fetchAll();

        $quotesEnriched = array_map(fn (array $quote): array => $this->enrichQuote($quote, $customers, $products), $quotes);

        return [
            'products' => $products,
            'customers' => $customers,
            'quotes' => $quotesEnriched,
            'monthlyClosed' => $this->monthlyClosed($quotesEnriched),
        ];
    }

    public function createQuote(array $payload): array
    {
        $customerId = (int) ($payload['customerId'] ?? 1);
        $validityDays = (int) ($payload['validityDays'] ?? 15);
        $notes = $payload['notes'] ?? '';
        $paymentTerms = $payload['paymentTerms'] ?? 'Contado';
        $items = $payload['items'] ?? [];

        if (empty($items)) {
            http_response_code(400);
            return ['error' => 'La cotizacion debe tener al menos un item'];
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO quotes (code, customerId, status, validityDays, notes, paymentTerms, sentByEmail, createdAt)
                VALUES (?, ?, 'Borrador', ?, ?, ?, 0, ?)
            ");
            $date = date('Y-m-d');
            $stmt->execute(['TEMP', $customerId, $validityDays, $notes, $paymentTerms, $date]);
            
            $quoteId = $this->pdo->lastInsertId();
            $code = 'COT-' . str_pad((string) $quoteId, 3, '0', STR_PAD_LEFT);
            $this->pdo->prepare("UPDATE quotes SET code = ? WHERE id = ?")->execute([$code, $quoteId]);

            $stmtItem = $this->pdo->prepare("
                INSERT INTO quote_items (quoteId, productId, quantity, unitPrice)
                VALUES (?, ?, ?, ?)
            ");
            foreach ($items as $item) {
                $stmtItem->execute([
                    $quoteId,
                    $item['productId'],
                    $item['quantity'],
                    $item['unitPrice']
                ]);
            }

            $this->pdo->commit();

            $quote = $this->pdo->query("SELECT * FROM quotes WHERE id = $quoteId")->fetch();
            $customers = $this->pdo->query("SELECT * FROM customers")->fetchAll();
            $products = $this->pdo->query("SELECT * FROM products")->fetchAll();

            return $this->enrichQuote($quote, $customers, $products);
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            http_response_code(500);
            return ['error' => 'Error al crear cotizacion'];
        }
    }

    public function convertQuote(int $quoteId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM quotes WHERE id = ?");
        $stmt->execute([$quoteId]);
        $quote = $stmt->fetch();

        if (!$quote) {
            http_response_code(404);
            return ['error' => 'Cotizacion no encontrada'];
        }

        $document = 'PED-' . str_pad((string) $quote['id'], 3, '0', STR_PAD_LEFT);
        $stmtUpdate = $this->pdo->prepare("UPDATE quotes SET status = 'Aceptada', convertedDocument = ? WHERE id = ?");
        $stmtUpdate->execute([$document, $quoteId]);

        $quote['status'] = 'Aceptada';
        $quote['convertedDocument'] = $document;

        $customers = $this->pdo->query("SELECT * FROM customers")->fetchAll();
        $products = $this->pdo->query("SELECT * FROM products")->fetchAll();

        return $this->enrichQuote($quote, $customers, $products);
    }

    private function enrichQuote(array $quote, array $customers, array $products): array
    {
        $customer = current(array_filter($customers, fn ($c) => (int)$c['id'] === (int)$quote['customerId']));

        $stmt = $this->pdo->prepare("SELECT * FROM quote_items WHERE quoteId = ?");
        $stmt->execute([$quote['id']]);
        $itemsRaw = $stmt->fetchAll();

        $items = array_map(function (array $item) use ($products): array {
            $product = current(array_filter($products, fn ($p) => (int)$p['id'] === (int)$item['productId']));
            return $item + [
                'product' => $product['name'] ?? 'Producto',
                'sku' => $product['sku'] ?? '',
                'subtotal' => round((float)$item['quantity'] * (float)$item['unitPrice'], 2),
            ];
        }, $itemsRaw);

        return $quote + [
            'customer' => $customer['name'] ?? 'Cliente',
            'items' => $items,
            'total' => round(array_sum(array_column($items, 'subtotal')), 2),
        ];
    }

    private function monthlyClosed(array $quotesEnriched): array
    {
        $accepted = array_filter($quotesEnriched, fn (array $quote): bool => $quote['status'] === 'Aceptada');
        return [
            'month' => date('Y-m'),
            'closedQuotes' => count($accepted),
            'closedAmount' => round(array_sum(array_column($accepted, 'total')), 2),
        ];
    }
}
