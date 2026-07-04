<?php

namespace App\Http\Controllers;

use App\Services\CompraService;
use Illuminate\Http\Request;

class CompraController extends Controller
{
    protected $service;

    public function __construct(CompraService $service)
    {
        $this->service = $service;
    }

    public function store(Request $request)
    {
        try {
            $item = $this->service->create($request->all());
            return $this->success($item, 'Compra registrada correctamente', 201);
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 400);
        }
    }

    public function index()
    {
        $items = \App\Models\CompraCabecera::orderBy('Id', 'desc')->get();
        return $this->success($items);
    }
}
