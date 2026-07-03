<?php

namespace App\Services;

use App\Models\CompraCabecera;
use App\Models\CompraDetalle;
use App\Models\Kardex;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Exception;

class CompraService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userId = Auth::id() ?? 1;
            $now = Carbon::now();

            $cabecera = CompraCabecera::create([
                'Fecha' => $data['Fecha'] ?? $now,
                'NumeroDocumento' => $data['NumeroDocumento'] ?? null,
                'Total' => $data['Total'],
                'Observacion' => $data['Observacion'] ?? '',
                'FechaCreacion' => $now,
                'UsuarioCreacion' => $userId,
                'Estado' => 1
            ]);

            foreach ($data['Detalles'] as $detalle) {
                $producto = Producto::lockForUpdate()->find($detalle['IdProducto']);
                if (!$producto) throw new Exception('Producto no encontrado');
                
                $stockAnterior = $producto->StockActual ?? 0;
                $nuevoStock = $stockAnterior + $detalle['Cantidad'];

                CompraDetalle::create([
                    'IdCompraCabecera' => $cabecera->Id,
                    'IdProducto' => $detalle['IdProducto'],
                    'Cantidad' => $detalle['Cantidad'],
                    'PrecioUnitario' => $detalle['PrecioUnitario'],
                    'Total' => $detalle['Total'],
                    'FechaCreacion' => $now,
                    'UsuarioCreacion' => $userId,
                    'Estado' => 1
                ]);

                Kardex::create([
                    'IdProducto' => $detalle['IdProducto'],
                    'Fecha' => $now,
                    'IdTipoMovimiento' => 1, // 1 = Entrada por Compra
                    'Cantidad' => $detalle['Cantidad'],
                    'CostoUnitario' => $detalle['PrecioUnitario'],
                    'StockAnterior' => $stockAnterior,
                    'StockActual' => $nuevoStock,
                    'Referencia' => 'Compra ' . $cabecera->Id,
                    'FechaCreacion' => $now,
                    'UsuarioCreacion' => $userId,
                    'Estado' => 1
                ]);
            }

            return $cabecera;
        });
    }
}
