<?php

namespace MicroErp\Application;

use MicroErp\Infrastructure\Persistence\MysqlDatabase;
use PDO;

final class InventoryService
{
    private PDO $pdo;

    public function __construct(MysqlDatabase $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function dashboard(): array
    {
        $products = $this->pdo->query("SELECT * FROM products")->fetchAll();
        $documents = $this->pdo->query("SELECT * FROM inventory_documents ORDER BY id DESC")->fetchAll();
        $movements = $this->pdo->query("
            SELECT m.*, d.type, d.date, d.responsible, d.notes, d.code 
            FROM movements m 
            JOIN inventory_documents d ON m.documentId = d.id 
            ORDER BY m.id DESC
        ")->fetchAll();

        $lowStock = array_filter($products, fn($p) => $p['stock'] < $p['minStock']);

        return [
            'products' => $products,
            'documents' => $documents,
            'movements' => $movements,
            'lowStock' => array_values($lowStock),
            'valuation' => $this->valuation($products),
            'traceability' => $this->traceability($products),
        ];
    }

    public function registerDocument(array $payload): array
    {
        $type = $payload['type'] ?? 'entrada';
        $responsible = $payload['responsible'] ?? 'Sistema';
        $notes = $payload['notes'] ?? '';
        $items = $payload['items'] ?? [];

        if (empty($items)) {
            http_response_code(400);
            return ['error' => 'El documento debe tener al menos un item'];
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO inventory_documents (code, type, date, responsible, notes) 
                VALUES (?, ?, ?, ?, ?)
            ");
            $date = date('Y-m-d');
            $stmt->execute(['TEMP', $type, $date, $responsible, $notes]);
            $documentId = $this->pdo->lastInsertId();

            $prefix = $type === 'entrada' ? 'ENT-' : 'SAL-';
            $code = $prefix . str_pad((string) $documentId, 3, '0', STR_PAD_LEFT);
            $this->pdo->prepare("UPDATE inventory_documents SET code = ? WHERE id = ?")->execute([$code, $documentId]);

            $stmtProduct = $this->pdo->prepare("SELECT * FROM products WHERE id = ?");
            $stmtUpdateStock = $this->pdo->prepare("UPDATE products SET stock = ? WHERE id = ?");
            $stmtMovement = $this->pdo->prepare("
                INSERT INTO movements (documentId, productId, quantity, batch, supplierId) 
                VALUES (?, ?, ?, ?, ?)
            ");

            foreach ($items as $item) {
                $productId = (int) $item['productId'];
                $quantity = max(1, (int) $item['quantity']);

                $stmtProduct->execute([$productId]);
                $product = $stmtProduct->fetch();

                if (!$product) continue;

                $newStock = $product['stock'] + ($type === 'entrada' ? $quantity : -$quantity);
                $newStock = max(0, $newStock);
                $stmtUpdateStock->execute([$newStock, $productId]);

                $stmtMovement->execute([
                    $documentId,
                    $productId,
                    $quantity,
                    $product['batch'],
                    $product['supplierId']
                ]);
            }

            $this->pdo->commit();
            return ['status' => 'ok', 'documentCode' => $code];
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            http_response_code(500);
            return ['error' => 'Error al registrar documento'];
        }
    }

    public function createProduct(array $payload): array
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO products (sku, name, stock, minStock, unitCost, salePrice, batch, supplierId, warehouseLocation)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $payload['sku'] ?? 'N/A',
            $payload['name'] ?? 'Nuevo Producto',
            (int) ($payload['stock'] ?? 0),
            (int) ($payload['minStock'] ?? 0),
            (float) ($payload['unitCost'] ?? 0),
            (float) ($payload['salePrice'] ?? 0),
            $payload['batch'] ?? 'N/A',
            (int) ($payload['supplierId'] ?? 1),
            $payload['warehouseLocation'] ?? 'N/A'
        ]);

        $id = $this->pdo->lastInsertId();
        return $this->pdo->query("SELECT * FROM products WHERE id = $id")->fetch();
    }

    public function updateProduct(int $id, array $payload): array
    {
        $stmt = $this->pdo->prepare("
            UPDATE products SET sku = ?, name = ?, minStock = ?, unitCost = ?, salePrice = ?, supplierId = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $payload['sku'] ?? 'N/A',
            $payload['name'] ?? 'Producto',
            (int) ($payload['minStock'] ?? 0),
            (float) ($payload['unitCost'] ?? 0),
            (float) ($payload['salePrice'] ?? 0),
            (int) ($payload['supplierId'] ?? 1),
            $id
        ]);
        return $this->pdo->query("SELECT * FROM products WHERE id = $id")->fetch() ?: [];
    }

    public function deleteProduct(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM movements WHERE productId = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            http_response_code(400);
            return ['error' => 'No se puede eliminar un producto con historial de movimientos en el Kardex.'];
        }

        $stmt = $this->pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        return ['status' => 'ok'];
    }

    private function valuation(array $products): array
    {
        $rows = array_map(function (array $product): array {
            $total = round((float)$product['unitCost'] * (int)$product['stock'], 2);
            return $product + ['totalCost' => $total];
        }, $products);

        return [
            'rows' => $rows,
            'total' => round(array_sum(array_column($rows, 'totalCost')), 2),
        ];
    }

    private function traceability(array $products): array
    {
        $suppliers = $this->pdo->query("SELECT * FROM suppliers")->fetchAll();
        $suppliersMap = [];
        foreach ($suppliers as $s) {
            $suppliersMap[(int)$s['id']] = $s['name'];
        }

        return array_map(function (array $product) use ($suppliersMap): array {
            return [
                'sku' => $product['sku'],
                'product' => $product['name'],
                'batch' => $product['batch'],
                'supplier' => $suppliersMap[(int)$product['supplierId']] ?? 'Sin proveedor',
                'warehouseLocation' => $product['warehouseLocation'],
                'stock' => $product['stock'],
            ];
        }, $products);
    }
}
