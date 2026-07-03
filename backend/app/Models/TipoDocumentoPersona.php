<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoDocumentoPersona extends Model
{
    protected $table = 'TipoDocumentoPersona';
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
