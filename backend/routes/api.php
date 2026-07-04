<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\TipoDocumentoPersonaController;
use App\Http\Controllers\TipoDocumentoController;
use App\Http\Controllers\FormaPagoController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\KardexController;

Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('me', [AuthController::class, 'me']);
    
    Route::apiResource('categorias', CategoriaController::class);
    Route::apiResource('marcas', MarcaController::class);
    Route::apiResource('clientes', ClienteController::class);
    Route::apiResource('tipos-documento-persona', TipoDocumentoPersonaController::class);
    Route::apiResource('tipos-documento', TipoDocumentoController::class);
    Route::apiResource('formas-pago', FormaPagoController::class);
    Route::apiResource('productos', ProductoController::class);
    Route::apiResource('usuarios', UsuarioController::class);
    Route::get('ventas', [VentaController::class, 'index']);
    Route::post('ventas', [VentaController::class, 'store']);
    Route::get('compras', [CompraController::class, 'index']);
    Route::post('compras', [CompraController::class, 'store']);
    Route::get('kardex', [KardexController::class, 'index']);
});
