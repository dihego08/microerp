<?php

namespace App\Services;

use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProductoService
{
    public function getAll()
    {
        return Producto::with('categorias')->where('Estado', 1)->get();
    }

    public function getById($id)
    {
        return Producto::with('categorias')->find($id);
    }

    public function create(array $data)
    {
        if (isset($data['password'])) { $data['PasswordHash'] = Hash::make($data['password']); }
        $data['FechaCreacion'] = Carbon::now();
        $data['UsuarioCreacion'] = Auth::id() ?? 1;
        $data['Estado'] = 1;
        
        $producto = Producto::create($data);
        
        if (isset($data['categorias']) && is_array($data['categorias'])) {
            $syncData = [];
            foreach ($data['categorias'] as $catId) {
                $syncData[$catId] = ['FechaCreacion' => Carbon::now(), 'UsuarioCreacion' => Auth::id() ?? 1, 'Estado' => 1];
            }
            $producto->categorias()->sync($syncData);
        }
        
        return $producto->load('categorias');
    }

    public function update($id, array $data)
    {
        $item = Producto::find($id);
        if ($item) {
            if (isset($data['password'])) { $data['PasswordHash'] = Hash::make($data['password']); }
            $data['FechaModificacion'] = Carbon::now();
            $data['UsuarioModificacion'] = Auth::id() ?? 1;
            $item->update($data);
            
            if (isset($data['categorias']) && is_array($data['categorias'])) {
                $syncData = [];
                foreach ($data['categorias'] as $catId) {
                    $syncData[$catId] = ['FechaCreacion' => Carbon::now(), 'UsuarioCreacion' => Auth::id() ?? 1, 'Estado' => 1];
                }
                $item->categorias()->sync($syncData);
            }
            $item->load('categorias');
        }
        return $item;
    }

    public function delete($id)
    {
        $item = Producto::find($id);
        if ($item) {
            $item->Estado = 0;
            $item->FechaModificacion = Carbon::now();
            $item->UsuarioModificacion = Auth::id() ?? 1;
            $item->save();
        }
        return $item;
    }
}
