<?php

namespace App\Http\Controllers;

use App\Services\VentaService;
use Illuminate\Http\Request;

class VentaController extends Controller
{
    protected $service;

    public function __construct(VentaService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request)
    {
        try {
            $item = $this->service->create($request->all());
            return $this->success($item, 'Venta registrada correctamente', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function index()
    {
        $items = \App\Models\VentaCabecera::orderBy('Id', 'desc')->get();
        return $this->success($items);
    }

    public function show($id)
    {
        $item = \App\Models\VentaCabecera::with(['detalles.producto'])->find($id);
        if (!$item) return $this->error('No encontrado', 404);
        return $this->success($item);
    }
}
