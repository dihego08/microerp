<?php

namespace MicroErp\Infrastructure\Persistence;

final class JsonDatabase
{
    public function __construct(private string $path)
    {
        if (!is_file($this->path)) {
            $this->write($this->seed());
        }
    }

    public function all(): array
    {
        $contents = file_get_contents($this->path);
        return json_decode($contents ?: '{}', true, flags: JSON_THROW_ON_ERROR);
    }

    public function save(array $data): void
    {
        $this->write($data);
    }

    private function write(array $data): void
    {
        file_put_contents(
            $this->path,
            json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)
        );
    }

    private function seed(): array
    {
        return [
            'products' => [
                [
                    'id' => 1,
                    'sku' => 'LIM-001',
                    'name' => 'Detergente industrial 5L',
                    'stock' => 18,
                    'minStock' => 12,
                    'unitCost' => 24.5,
                    'salePrice' => 39.9,
                    'batch' => 'LT-2026-041',
                    'supplierId' => 1,
                    'warehouseLocation' => 'A-01-03',
                ],
                [
                    'id' => 2,
                    'sku' => 'SEG-014',
                    'name' => 'Guantes de nitrilo caja x100',
                    'stock' => 6,
                    'minStock' => 15,
                    'unitCost' => 18.2,
                    'salePrice' => 31.0,
                    'batch' => 'LT-2026-022',
                    'supplierId' => 2,
                    'warehouseLocation' => 'B-02-01',
                ],
                [
                    'id' => 3,
                    'sku' => 'FER-120',
                    'name' => 'Tornillo galvanizado 1/2',
                    'stock' => 450,
                    'minStock' => 200,
                    'unitCost' => 0.18,
                    'salePrice' => 0.35,
                    'batch' => 'LT-2026-010',
                    'supplierId' => 3,
                    'warehouseLocation' => 'C-04-02',
                ],
            ],
            'movements' => [
                [
                    'id' => 1,
                    'productId' => 1,
                    'type' => 'entrada',
                    'quantity' => 20,
                    'date' => '2026-04-26',
                    'reason' => 'Recepcion OC-001',
                    'batch' => 'LT-2026-041',
                    'supplierId' => 1,
                ],
                [
                    'id' => 2,
                    'productId' => 2,
                    'type' => 'salida',
                    'quantity' => 9,
                    'date' => '2026-04-28',
                    'reason' => 'Venta FV-001',
                    'batch' => 'LT-2026-022',
                    'supplierId' => 2,
                ],
            ],
            'suppliers' => [
                [
                    'id' => 1,
                    'name' => 'Quimicos Andinos SAC',
                    'contact' => 'Mariela Soto',
                    'email' => 'ventas@quimicosandinos.test',
                    'paymentTerms' => 'Credito 30 dias',
                    'phone' => '+51 987 111 222',
                ],
                [
                    'id' => 2,
                    'name' => 'Bioseguridad Total',
                    'contact' => 'Jorge Rivas',
                    'email' => 'contacto@bioseguridad.test',
                    'paymentTerms' => 'Contado',
                    'phone' => '+51 987 333 444',
                ],
                [
                    'id' => 3,
                    'name' => 'Ferreteria Mayorista Norte',
                    'contact' => 'Lucia Pena',
                    'email' => 'oc@mayoristanorte.test',
                    'paymentTerms' => 'Credito 15 dias',
                    'phone' => '+51 987 555 666',
                ],
            ],
            'purchaseOrders' => [
                [
                    'id' => 1,
                    'code' => 'OC-001',
                    'supplierId' => 1,
                    'status' => 'Recibido',
                    'promisedDate' => '2026-04-25',
                    'receivedDate' => '2026-04-26',
                    'items' => [
                        ['productId' => 1, 'quantity' => 20, 'unitCost' => 24.5],
                    ],
                ],
                [
                    'id' => 2,
                    'code' => 'OC-002',
                    'supplierId' => 2,
                    'status' => 'Pendiente',
                    'promisedDate' => '2026-05-03',
                    'receivedDate' => null,
                    'items' => [
                        ['productId' => 2, 'quantity' => 40, 'unitCost' => 18.2],
                    ],
                ],
            ],
            'customers' => [
                [
                    'id' => 1,
                    'name' => 'Minimarket El Sol',
                    'category' => 'Oro',
                    'address' => 'Av. Los Jardines 240, Lima',
                    'creditLimit' => 5000,
                    'creditUsed' => 1650,
                    'lastPurchaseDate' => '2026-04-18',
                ],
                [
                    'id' => 2,
                    'name' => 'Servicios Integrales Pardo',
                    'category' => 'Plata',
                    'address' => 'Jr. Comercio 181, Callao',
                    'creditLimit' => 2500,
                    'creditUsed' => 400,
                    'lastPurchaseDate' => '2026-03-12',
                ],
            ],
            'quotes' => [
                [
                    'id' => 1,
                    'code' => 'COT-001',
                    'customerId' => 1,
                    'status' => 'Aceptada',
                    'sentByEmail' => true,
                    'createdAt' => '2026-04-20',
                    'convertedDocument' => 'PED-001',
                    'items' => [
                        ['productId' => 1, 'quantity' => 5, 'unitPrice' => 39.9],
                        ['productId' => 2, 'quantity' => 3, 'unitPrice' => 31.0],
                    ],
                ],
                [
                    'id' => 2,
                    'code' => 'COT-002',
                    'customerId' => 2,
                    'status' => 'Enviada por correo',
                    'sentByEmail' => true,
                    'createdAt' => '2026-04-24',
                    'convertedDocument' => null,
                    'items' => [
                        ['productId' => 3, 'quantity' => 200, 'unitPrice' => 0.35],
                    ],
                ],
            ],
            'salesHistory' => [
                ['customerId' => 1, 'document' => 'FV-001', 'date' => '2026-04-18', 'total' => 980.5],
                ['customerId' => 1, 'document' => 'FV-002', 'date' => '2026-04-25', 'total' => 292.5],
                ['customerId' => 2, 'document' => 'FV-003', 'date' => '2026-03-12', 'total' => 410.0],
            ],
        ];
    }
}
