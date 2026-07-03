<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'Cliente';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'TipoDocumento',
        'NumeroDocumento',
        'Nombre',
        'Direccion',
        'Telefono',
        'Correo',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];
}
