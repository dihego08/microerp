<?php

namespace App\Services;

use App\Models\VentaCabecera;
use App\Models\VentaDetalle;
use App\Models\Kardex;
use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Exception;

class VentaService
{
    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $userId = Auth::id() ?? 1;
            $now = Carbon::now();

            $cabecera = VentaCabecera::create([
                'NumeroVenta' => $data['NumeroVenta'] ?? uniqid('V-'),
                'Fecha' => $data['Fecha'] ?? $now,
                'IdCliente' => $data['IdCliente'],
                'IdUsuario' => $userId,
                'IdTipoDocumento' => $data['IdTipoDocumento'],
                'IdFormaPago' => $data['IdFormaPago'],
                'Subtotal' => $data['Subtotal'],
                'IGV' => $data['IGV'],
                'Total' => $data['Total'],
                'FechaCreacion' => $now,
                'UsuarioCreacion' => $userId,
                'Estado' => 1
            ]);

            foreach ($data['Detalles'] as $detalle) {
                $producto = Producto::lockForUpdate()->find($detalle['IdProducto']);
                if (!$producto) throw new Exception('Producto no encontrado');
                
                $stockAnterior = $producto->StockActual ?? 0;
                $nuevoStock = $stockAnterior - $detalle['Cantidad'];
                
                if ($nuevoStock < 0) {
                    throw new Exception('Stock insuficiente para el producto ' . $producto->Nombre);
                }

                VentaDetalle::create([
                    'IdVentaCabecera' => $cabecera->Id,
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
                    'IdTipoMovimiento' => 2, // 2 = Salida por Venta
                    'Cantidad' => $detalle['Cantidad'],
                    'CostoUnitario' => $detalle['PrecioUnitario'],
                    'StockAnterior' => $stockAnterior,
                    'StockActual' => $nuevoStock,
                    'Referencia' => 'Venta ' . $cabecera->Id,
                    'FechaCreacion' => $now,
                    'UsuarioCreacion' => $userId,
                    'Estado' => 1
                ]);

                $producto->StockActual = $nuevoStock;
                $producto->save();
            }

            return $cabecera;
        });
    }
}
