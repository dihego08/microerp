<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'Producto';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'Codigo',
        'CodigoBarras',
        'Nombre',
        'Descripcion',
        'IdMarca',
        'PrecioCompra',
        'PrecioVenta',
        'StockMinimo',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];

    public function categorias()
    {
        return $this->belongsToMany(Categoria::class, 'ProductoCategoria', 'IdProducto', 'IdCategoria')
                    ->where('ProductoCategoria.Estado', 1);
    }
}
