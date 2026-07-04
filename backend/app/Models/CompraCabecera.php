<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompraCabecera extends Model
{
    protected $table = 'CompraCabecera';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'Fecha',
        'NumeroDocumento',
        'Total',
        'Observacion',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];
}
