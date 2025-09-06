<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepoimentoController;
use App\Http\Controllers\UsuarioController;

Route::apiResource('depoimentos', DepoimentoController::class);
Route::apiResource('usuarios', UsuarioController::class);