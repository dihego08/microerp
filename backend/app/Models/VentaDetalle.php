<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaDetalle extends Model
{
    protected $table = 'VentaDetalle';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'IdVentaCabecera',
        'IdProducto',
        'Cantidad',
        'PrecioUnitario',
        'Total',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'IdProducto');
    }
}
