<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kardex extends Model
{
    protected $table = 'Kardex';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'IdProducto',
        'Fecha',
        'IdTipoMovimiento',
        'Cantidad',
        'CostoUnitario',
        'StockAnterior',
        'StockActual',
        'Referencia',
        'Observacion',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];
}
