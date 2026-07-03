<?php

namespace App\Services;

use App\Models\Producto;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProductoService
{
    protected function storeImagen(UploadedFile $file, ?string $oldFilename = null): string
    {
        $dir = public_path('uploads/productos');
        if (!file_exists($dir)) {
            mkdir($dir, 0755, true);
        }

        if ($oldFilename) {
            $oldPath = $dir . DIRECTORY_SEPARATOR . $oldFilename;
            if (file_exists($oldPath)) {
                @unlink($oldPath);
            }
        }

        $filename = uniqid('prod_') . '.' . $file->getClientOriginalExtension();
        $file->move($dir, $filename);

        return $filename;
    }

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
        if (isset($data['imagen']) && $data['imagen'] instanceof UploadedFile) {
            $data['imagen'] = $this->storeImagen($data['imagen']);
        } else {
            unset($data['imagen']);
        }
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
            if (isset($data['imagen']) && $data['imagen'] instanceof UploadedFile) {
                $data['imagen'] = $this->storeImagen($data['imagen'], $item->imagen);
            } else {
                unset($data['imagen']);
            }
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
