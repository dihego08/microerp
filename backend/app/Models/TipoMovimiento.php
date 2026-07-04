<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoMovimiento extends Model
{
    protected $table = 'TipoMovimiento';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'Nombre',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];
}
