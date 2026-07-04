<?php

namespace App\Services;

use App\Models\Cliente;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ClienteService
{
    public function getAll()
    {
        return Cliente::where('Estado', 1)->get();
    }

    public function getById($id)
    {
        return Cliente::find($id);
    }

    public function create(array $data)
    {
        $data['FechaCreacion'] = Carbon::now();
        $data['UsuarioCreacion'] = Auth::id() ?? 1;
        $data['Estado'] = 1;
        return Cliente::create($data);
    }

    public function update($id, array $data)
    {
        $item = Cliente::find($id);
        if ($item) {
            $data['FechaModificacion'] = Carbon::now();
            $data['UsuarioModificacion'] = Auth::id() ?? 1;
            $item->update($data);
        }
        return $item;
    }

    public function delete($id)
    {
        $item = Cliente::find($id);
        if ($item) {
            $item->Estado = 0;
            $item->FechaModificacion = Carbon::now();
            $item->UsuarioModificacion = Auth::id() ?? 1;
            $item->save();
        }
        return $item;
    }
}
