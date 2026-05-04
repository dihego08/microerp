<?php

namespace MicroErp\Domain;

final class Product
{
    public function __construct(
        public int $id,
        public string $sku,
        public string $name,
        public int $stock,
        public int $minStock,
        public float $unitCost,
        public float $salePrice,
        public string $batch,
        public int $supplierId,
        public string $warehouseLocation,
    ) {
    }

    public function isBelowMinimum(): bool
    {
        return $this->stock < $this->minStock;
    }

    public function totalCost(): float
    {
        return round($this->stock * $this->unitCost, 2);
    }
}
