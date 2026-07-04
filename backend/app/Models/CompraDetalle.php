<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraDetalle extends Model
{
    protected $table = 'CompraDetalle';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'IdCompraCabecera',
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
