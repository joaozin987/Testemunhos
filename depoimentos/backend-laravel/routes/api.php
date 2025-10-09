<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DepoimentoController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use App\Http\Controllers\AdminController;

Route::post('/register', [UsuarioController::class, 'register']);
Route::post('/login', [UsuarioController::class, 'login']);
Route::get('/depoimentos', [DepoimentoController::class, 'index']);

Route::post('/auth/forgot-password', [UsuarioController::class, 'forgotPassword'])
    ->name('auth.forgot-password');

Route::post('/auth/reset-password', [UsuarioController::class, 'resetPassword'])
    ->name('auth.reset-password');
Route::middleware('auth:sanctum')->delete('/depoimentos/{id}', [DepoimentoController::class, 'destroy']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UsuarioController::class, 'logout']);

    Route::get('/perfil',[UsuarioController::class, 'perfil']);
    Route::put('/perfil', [UsuarioController::class, 'atualizarPerfil']);
    Route::post('/depoimentos', [DepoimentoController::class, 'store']);
});

Route::middleware(['auth:sanctum'])->prefix('admin')->group(function () {
    Route::get('/usuarios', [AdminController::class, 'index']);
    Route::get('/usuarios/{id}', [AdminController::class, 'show']);
    Route::put('/usuarios/{id}/make-admin', [AdminController::class, 'makeAdmin']);
    Route::delete('/usuarios/{id}', [AdminController::class, 'destroy']);
    Route::get('/depoimentos', [AdminController::class, 'adminIndex']);
    Route::post('depoimentos/{id}', [AdminController::class, 'aprovarDepoimento']);
});
