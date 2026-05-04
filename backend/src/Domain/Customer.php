<?php

namespace MicroErp\Domain;

final class Customer
{
    public function __construct(
        public int $id,
        public string $name,
        public string $category,
        public string $address,
        public float $creditLimit,
        public float $creditUsed,
        public string $lastPurchaseDate,
    ) {
    }

    public function availableCredit(): float
    {
        return round($this->creditLimit - $this->creditUsed, 2);
    }
}
