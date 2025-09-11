<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DepoimentoController;
use App\Models\Usuario;

Route::post('/register', [UsuarioController::class, 'register']);
Route::post('/login', [UsuarioController::class, 'login']);

Route::get('/depoimentos', [DepoimentoController::class, 'index']);
Route::get('/depoimentos/{id}', [DepoimentoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UsuarioController::class, 'logout']);

    Route::get('/perfil',[UsuarioController::class, 'perfil']);
    Route::put('/perfil', [UsuarioController::class, 'atualizarPerfil']);
    Route::post('/depoimentos', [DepoimentoController::class, 'store']);
});
