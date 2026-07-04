<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class Usuario extends Authenticatable implements JWTSubject
{
    protected $table = 'Usuario';
    protected $primaryKey = 'Id';
    public $timestamps = false;

    protected $fillable = [
        'Nombres',
        'Apellidos',
        'Correo',
        'Celular',
        'Usuario',
        'PasswordHash',
        'FechaCreacion',
        'UsuarioCreacion',
        'FechaModificacion',
        'UsuarioModificacion',
        'Estado'
    ];

    protected $hidden = [
        'PasswordHash',
    ];

    public function getAuthPassword()
    {
        return $this->PasswordHash;
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'Nombres' => $this->Nombres,
            'Apellidos' => $this->Apellidos,
            'Usuario' => $this->Usuario,
        ];
    }
}
