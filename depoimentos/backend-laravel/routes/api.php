<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\DepoimentoController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout']);
Route::post('/usuarios', [UsuarioController::class, 'store']); 


Route::get('/depoimentos', [DepoimentoController::class, 'index']);
Route::get('/depoimentos/{id}', [DepoimentoController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    
   
    Route::get('/user', function (Request $request) {
        return response()->json($request->user());
    });
    
    Route::put('/usuarios/{id}', [UsuarioController::class, 'update']);
    Route::delete('/usuarios/{id}', [UsuarioController::class, 'destroy']);
    
   
    Route::post('/depoimentos', [DepoimentoController::class, 'store']);
    Route::put('/depoimentos/{id}', [DepoimentoController::class, 'update']);
    Route::delete('/depoimentos/{id}', [DepoimentoController::class, 'destroy']);
    
   
    Route::prefix('admin')->group(function () {
        Route::get('/usuarios', [AdminController::class, 'index']);
        Route::get('/usuarios/{id}', [AdminController::class, 'show']);
        Route::post('/usuarios/{id}/make-admin', [AdminController::class, 'makeAdmin']);
        Route::delete('/usuarios/{id}', [AdminController::class, 'destroy']);
    });
});