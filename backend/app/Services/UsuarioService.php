<?php

namespace App\Services;

use App\Models\Usuario;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UsuarioService
{
    public function getAll()
    {
        return Usuario::where('Estado', 1)->get();
    }

    public function getById($id)
    {
        return Usuario::find($id);
    }

    public function create(array $data)
    {
        if (isset($data['password'])) { $data['PasswordHash'] = Hash::make($data['password']); }
        $data['FechaCreacion'] = Carbon::now();
        $data['UsuarioCreacion'] = Auth::id() ?? 1;
        $data['Estado'] = 1;
        return Usuario::create($data);
    }

    public function update($id, array $data)
    {
        $item = Usuario::find($id);
        if ($item) {
            if (isset($data['password'])) { $data['PasswordHash'] = Hash::make($data['password']); }
            $data['FechaModificacion'] = Carbon::now();
            $data['UsuarioModificacion'] = Auth::id() ?? 1;
            $item->update($data);
        }
        return $item;
    }

    public function delete($id)
    {
        $item = Usuario::find($id);
        if ($item) {
            $item->Estado = 0;
            $item->FechaModificacion = Carbon::now();
            $item->UsuarioModificacion = Auth::id() ?? 1;
            $item->save();
        }
        return $item;
    }
}
