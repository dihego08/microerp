<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormaPago extends Model
{
    protected $table = 'FormaPago';
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
