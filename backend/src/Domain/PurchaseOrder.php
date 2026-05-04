<?php

namespace MicroErp\Domain;

final class PurchaseOrder
{
    public function __construct(
        public int $id,
        public string $code,
        public int $supplierId,
        public string $status,
        public string $promisedDate,
        public ?string $receivedDate,
        public array $items,
    ) {
    }

    public function total(): float
    {
        return round(array_sum(array_map(
            fn (array $item): float => $item['quantity'] * $item['unitCost'],
            $this->items
        )), 2);
    }

    public function isReceived(): bool
    {
        return $this->status === 'Recibido';
    }
}
