<?php

namespace App\Http\Controllers;

use App\Services\UsuarioService;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    protected $service;

    public function __construct(UsuarioService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        return $this->success($this->service->getAll());
    }

    public function show($id)
    {
        $item = $this->service->getById($id);
        if (!$item) return $this->error('No encontrado', 404);
        return $this->success($item);
    }

    public function store(Request $request)
    {
        $item = $this->service->create($request->all());
        return $this->success($item, 'Creado correctamente', 201);
    }

    public function update(Request $request, $id)
    {
        $item = $this->service->update($id, $request->all());
        if (!$item) return $this->error('No encontrado', 404);
        return $this->success($item, 'Actualizado correctamente');
    }

    public function destroy($id)
    {
        $item = $this->service->delete($id);
        if (!$item) return $this->error('No encontrado', 404);
        return $this->success(null, 'Eliminado correctamente');
    }
}
