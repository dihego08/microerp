<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    protected $table = 'Cliente';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'IdTipoDocumento',
        'NumeroDocumento',
        'Nombres',
        'Apellidos',
        'Direccion',
        'Celular',
        'Correo',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];

    public function tipoDocumento()
    {
        return $this->belongsTo(TipoDocumentoPersona::class, 'IdTipoDocumento');
    }
}
