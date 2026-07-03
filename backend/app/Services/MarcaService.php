<?php

namespace App\Services;

use App\Models\Marca;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class MarcaService
{
    public function getAll()
    {
        return Marca::where('Estado', 1)->get();
    }

    public function getById($id)
    {
        return Marca::find($id);
    }

    public function create(array $data)
    {
        $data['FechaCreacion'] = Carbon::now();
        $data['UsuarioCreacion'] = Auth::id() ?? 1;
        $data['Estado'] = 1;
        return Marca::create($data);
    }

    public function update($id, array $data)
    {
        $item = Marca::find($id);
        if ($item) {
            $data['FechaModificacion'] = Carbon::now();
            $data['UsuarioModificacion'] = Auth::id() ?? 1;
            $item->update($data);
        }
        return $item;
    }

    public function delete($id)
    {
        $item = Marca::find($id);
        if ($item) {
            $item->Estado = 0;
            $item->FechaModificacion = Carbon::now();
            $item->UsuarioModificacion = Auth::id() ?? 1;
            $item->save();
        }
        return $item;
    }
}
