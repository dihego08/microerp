<?php

namespace App\Http\Controllers;

use App\Models\Kardex;
use Illuminate\Http\Request;

class KardexController extends Controller
{
    public function index(Request $request)
    {
        $query = Kardex::query();
        if ($request->has('producto_id')) {
            $query->where('IdProducto', $request->producto_id);
        }
        return $this->success($query->orderBy('Fecha', 'desc')->get());
    }
}
