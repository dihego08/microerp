<?php

namespace MicroErp\Application;

use MicroErp\Infrastructure\Persistence\MysqlDatabase;
use PDO;

final class PurchaseService
{
    private PDO $pdo;

    public function __construct(MysqlDatabase $database)
    {
        $this->pdo = $database->getConnection();
    }

    public function overview(): array
    {
        $suppliers = $this->pdo->query("SELECT * FROM suppliers")->fetchAll();
        $orders = $this->pdo->query("SELECT * FROM purchase_orders ORDER BY id DESC")->fetchAll();

        $ordersEnriched = array_map(fn (array $order): array => $this->enrichOrder($order, $suppliers), $orders);

        return [
            'suppliers' => $suppliers,
            'purchaseOrders' => $ordersEnriched,
            'compliance' => $this->compliance($ordersEnriched),
        ];
    }

    public function createPurchaseOrder(array $payload): array
    {
        $supplierId = (int) ($payload['supplierId'] ?? 1);
        $promisedDate = $payload['promisedDate'] ?? date('Y-m-d');
        $items = $payload['items'] ?? [];

        if (empty($items)) {
            http_response_code(400);
            return ['error' => 'La orden debe tener al menos un item'];
        }

        $this->pdo->beginTransaction();
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO purchase_orders (code, supplierId, status, promisedDate)
                VALUES (?, ?, 'Pendiente', ?)
            ");
            $stmt->execute(['TEMP', $supplierId, $promisedDate]);
            $orderId = $this->pdo->lastInsertId();

            $code = 'OC-' . str_pad((string) $orderId, 3, '0', STR_PAD_LEFT);
            $this->pdo->prepare("UPDATE purchase_orders SET code = ? WHERE id = ?")->execute([$code, $orderId]);

            $stmtItem = $this->pdo->prepare("
                INSERT INTO purchase_order_items (purchaseOrderId, productId, quantity, unitCost)
                VALUES (?, ?, ?, ?)
            ");
            foreach ($items as $item) {
                $stmtItem->execute([
                    $orderId,
                    $item['productId'],
                    $item['quantity'],
                    $item['unitCost']
                ]);
            }

            $this->pdo->commit();

            $order = $this->pdo->query("SELECT * FROM purchase_orders WHERE id = $orderId")->fetch();
            $suppliers = $this->pdo->query("SELECT * FROM suppliers")->fetchAll();

            return $this->enrichOrder($order, $suppliers);
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            http_response_code(500);
            return ['error' => 'Error al crear orden de compra'];
        }
    }

    public function receive(int $orderId): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM purchase_orders WHERE id = ?");
        $stmt->execute([$orderId]);
        $order = $stmt->fetch();

        if (!$order) {
            http_response_code(404);
            return ['error' => 'Orden de compra no encontrada'];
        }

        if ($order['status'] !== 'Recibido') {
            $this->pdo->beginTransaction();
            try {
                $date = date('Y-m-d');
                $reason = 'Recepcion OC ' . $order['code'];

                // 1. Crear el documento de almacen
                $stmtDoc = $this->pdo->prepare("
                    INSERT INTO inventory_documents (code, type, date, responsible, notes) 
                    VALUES (?, 'entrada', ?, ?, ?)
                ");
                $stmtDoc->execute(['TEMP', $date, 'Almacén', $reason]);
                $documentId = $this->pdo->lastInsertId();

                $docCode = 'ENT-' . str_pad((string) $documentId, 3, '0', STR_PAD_LEFT);
                $this->pdo->prepare("UPDATE inventory_documents SET code = ? WHERE id = ?")->execute([$docCode, $documentId]);

                // 2. Insertar movimientos y actualizar stock
                $stmtItems = $this->pdo->prepare("SELECT * FROM purchase_order_items WHERE purchaseOrderId = ?");
                $stmtItems->execute([$orderId]);
                $items = $stmtItems->fetchAll();

                $stmtUpdateProduct = $this->pdo->prepare("UPDATE products SET stock = stock + ? WHERE id = ?");
                $stmtInsertMovement = $this->pdo->prepare("
                    INSERT INTO movements (documentId, productId, quantity, batch, supplierId)
                    VALUES (?, ?, ?, ?, ?)
                ");

                foreach ($items as $item) {
                    $stmtUpdateProduct->execute([$item['quantity'], $item['productId']]);
                    
                    $stmtProd = $this->pdo->prepare("SELECT batch FROM products WHERE id = ?");
                    $stmtProd->execute([$item['productId']]);
                    $product = $stmtProd->fetch();

                    $stmtInsertMovement->execute([
                        $documentId,
                        $item['productId'],
                        $item['quantity'],
                        $product['batch'] ?? 'N/A',
                        $order['supplierId']
                    ]);
                }

                // 3. Actualizar estado de la OC
                $stmtUpdateOrder = $this->pdo->prepare("UPDATE purchase_orders SET status = 'Recibido', receivedDate = ? WHERE id = ?");
                $stmtUpdateOrder->execute([$date, $orderId]);

                $this->pdo->commit();
                $order['status'] = 'Recibido';
                $order['receivedDate'] = $date;
            } catch (\Exception $e) {
                $this->pdo->rollBack();
                http_response_code(500);
                return ['error' => 'Error al recibir la orden de compra'];
            }
        }

        $suppliers = $this->pdo->query("SELECT * FROM suppliers")->fetchAll();
        return $this->enrichOrder($order, $suppliers);
    }

    private function enrichOrder(array $order, array $suppliers): array
    {
        $supplier = current(array_filter($suppliers, fn ($s) => (int)$s['id'] === (int)$order['supplierId']));

        $stmt = $this->pdo->prepare("SELECT * FROM purchase_order_items WHERE purchaseOrderId = ?");
        $stmt->execute([$order['id']]);
        $items = $stmt->fetchAll();

        return $order + [
            'supplier' => $supplier['name'] ?? 'Proveedor',
            'items' => $items,
            'total' => round(array_sum(array_map(
                fn (array $item): float => (float)$item['quantity'] * (float)$item['unitCost'],
                $items
            )), 2),
        ];
    }

    private function compliance(array $ordersEnriched): array
    {
        return array_map(function (array $enriched): array {
            $daysLate = null;
            if ($enriched['receivedDate']) {
                $daysLate = max(0, (strtotime($enriched['receivedDate']) - strtotime($enriched['promisedDate'])) / 86400);
            }

            return [
                'code' => $enriched['code'],
                'supplier' => $enriched['supplier'],
                'promisedDate' => $enriched['promisedDate'],
                'receivedDate' => $enriched['receivedDate'] ?? 'Pendiente',
                'daysLate' => $daysLate,
                'status' => $enriched['status'],
            ];
        }, $ordersEnriched);
    }

    public function createSupplier(array $payload): array
    {
        $stmt = $this->pdo->prepare("
            INSERT INTO suppliers (name, contact, email, paymentTerms, phone)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $payload['name'] ?? 'Nuevo Proveedor',
            $payload['contact'] ?? 'Sin contacto',
            $payload['email'] ?? 'correo@ejemplo.com',
            $payload['paymentTerms'] ?? 'Contado',
            $payload['phone'] ?? '000000000'
        ]);

        $id = $this->pdo->lastInsertId();
        return $this->pdo->query("SELECT * FROM suppliers WHERE id = $id")->fetch();
    }

    public function updateSupplier(int $id, array $payload): array
    {
        $stmt = $this->pdo->prepare("
            UPDATE suppliers SET name = ?, contact = ?, email = ?, paymentTerms = ?, phone = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $payload['name'] ?? 'Proveedor',
            $payload['contact'] ?? 'Sin contacto',
            $payload['email'] ?? 'correo@ejemplo.com',
            $payload['paymentTerms'] ?? 'Contado',
            $payload['phone'] ?? '000000000',
            $id
        ]);
        return $this->pdo->query("SELECT * FROM suppliers WHERE id = $id")->fetch() ?: [];
    }

    public function deleteSupplier(int $id): array
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM purchase_orders WHERE supplierId = ?");
        $stmt->execute([$id]);
        if ($stmt->fetchColumn() > 0) {
            http_response_code(400);
            return ['error' => 'No se puede eliminar un proveedor con órdenes de compra registradas.'];
        }

        $stmt = $this->pdo->prepare("DELETE FROM suppliers WHERE id = ?");
        $stmt->execute([$id]);
        return ['status' => 'ok'];
    }
}
