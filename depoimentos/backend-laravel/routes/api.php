<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DepoimentoController;

Route::post('/register', [UsuarioController::class, 'register']);
Route::post('/login', [UsuarioController::class, 'login']);

Route::get('/depoimentos', [DepoimentoController::class, 'index']);
Route::get('/depoimentos/{id}', [DepoimentoController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {


    Route::post('/logout', [UsuarioController::class, 'logout']);

    Route::get('/perfil',[UsuarioController::class, 'perfil']);
    Route::post('/depoimentos', [DepoimentoController::class, 'store']);
    Route::put('/depoimentos/{id}', [DepoimentoController::class, 'update']);
    Route::delete('/depoimentos/{id}', [DepoimentoController::class, 'destroy']);
});
