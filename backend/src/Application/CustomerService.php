<?php

namespace MicroErp\Application;

use MicroErp\Infrastructure\Persistence\MysqlDatabase;
use PDO;

final class CustomerService
{
    private PDO $pdo;

    public function __construct(MysqlDatabase $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function overview(): array
    {
        $customers = $this->pdo->query("SELECT * FROM customers")->fetchAll();
        
        return [
            'customers' => array_map(function (array $customer): array {
                $stmt = $this->pdo->prepare("SELECT * FROM sales_history WHERE customerId = ? ORDER BY date DESC");
                $stmt->execute([$customer['id']]);
                $history = $stmt->fetchAll();

                return $customer + [
                    'availableCredit' => (float)$customer['creditLimit'] - (float)$customer['creditUsed'],
                    'purchaseHistory' => $history,
                ];
            }, $customers),
            'segments' => [
                'gold' => $this->pdo->query("SELECT * FROM customers WHERE category = 'Oro'")->fetchAll(),
                'inactive30Days' => $this->pdo->query("SELECT * FROM customers WHERE lastPurchaseDate < DATE_SUB(CURDATE(), INTERVAL 30 DAY)")->fetchAll(),
            ],
        ];
    }

    public function createCustomer(array $payload): array
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO customers (name, category, address, creditLimit, creditUsed, lastPurchaseDate)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $payload['name'] ?? 'Nuevo Cliente',
            $payload['category'] ?? 'Plata',
            $payload['address'] ?? 'Sin dirección',
            (float) ($payload['creditLimit'] ?? 0),
            0,
            date('Y-m-d')
        ]);

        $id = $this->pdo->lastInsertId();
        return $this->pdo->query("SELECT * FROM customers WHERE id = $id")->fetch();
    }

    public function updateCustomer(int $id, array $payload): array
    {
        $stmt = $this->pdo->prepare("
            UPDATE customers SET name = ?, category = ?, address = ?, creditLimit = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $payload['name'] ?? 'Cliente',
            $payload['category'] ?? 'Plata',
            $payload['address'] ?? 'Sin dirección',
            (float) ($payload['creditLimit'] ?? 0),
            $id
        ]);
        return $this->pdo->query("SELECT * FROM customers WHERE id = $id")->fetch() ?: [];
    }

    public function deleteCustomer(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM sales_history WHERE customerId = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            http_response_code(400);
            return ['error' => 'No se puede eliminar un cliente con historial de compras.'];
        }

        $stmt = $this->pdo->prepare("DELETE FROM customers WHERE id = ?");
        $stmt->execute([$id]);
        return ['status' => 'ok'];
    }
}
