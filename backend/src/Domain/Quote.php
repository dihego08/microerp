<?php

namespace MicroErp\Domain;

final class Quote
{
    public function __construct(
        public int $id,
        public string $code,
        public int $customerId,
        public string $status,
        public array $items,
        public ?string $convertedDocument,
    ) {
    }

    public function total(): float
    {
        return round(array_sum(array_map(
            fn (array $item): float => $item['quantity'] * $item['unitPrice'],
            $this->items
        )), 2);
    }

    public function wasConverted(): bool
    {
        return $this->convertedDocument !== null;
    }
}
