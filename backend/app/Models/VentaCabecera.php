<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VentaCabecera extends Model
{
    protected $table = 'VentaCabecera';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'NumeroVenta',
        'Fecha',
        'IdCliente',
        'IdUsuario',
        'IdTipoDocumento',
        'IdFormaPago',
        'Subtotal',
        'IGV',
        'Total',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];

    public function detalles()
    {
        return $this->hasMany(VentaDetalle::class, 'IdVentaCabecera');
    }
}
