<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoCategoria extends Model
{
    protected $table = 'ProductoCategoria';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'IdProducto',
        'IdCategoria',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];
}
