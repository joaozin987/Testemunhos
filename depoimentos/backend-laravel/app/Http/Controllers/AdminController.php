<?php

namespace App\Http\Controllers;

use App\Models\Depoimento;
use Illuminate\Http\Request;
use App\Models\Usuario;

class AdminController extends Controller
{
    public function __construct()
    {
    $this->middleware(function ($request, $next) {
    if (!$request->user() || $request->user()->role !== 1) {
        return response()->json(['error' => 'Acesso não autorizado'], 403);
    }

    return $next($request);
});
 }

    public function index()
    {
        $usuarios = Usuario::all();
        return response()->json($usuarios);
    }

    public function show($id)
    {
        $usuario = Usuario::findOrFail($id);
        
        return response()->json([
            'id' => $usuario->id,
            'nome' => $usuario->nome,
            'email' => $usuario->email,
            'is_admin' => $usuario->is_admin,
            'created_at' => $usuario->created_at,
            'updated_at' => $usuario->updated_at,
        ]);
    }

    public function adminIndex(){
        $depoimentos = Depoimento::all();
        return response()->json($depoimentos);
    }
     public function aprovarDepoimento($id) {
    $depoimento = Depoimento::findOrFail($id);
    $depoimento->aprovado = true;
    $depoimento->save();

    return response()->json([
        'message' => 'Depoimento aprovado',
        'depoimento' => $depoimento
    ]);
}

    public function makeAdmin($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->role = 1;
        $usuario->save();

        return response()->json([
        'message' => 'Usuário promovido a admin com sucesso',
         'usuario' => $usuario
    ]);
        

    }

    public function destroy($id)
    {
       
        if ($id == auth()->id()) {
            return response()->json(['error' => 'Você não pode se deletar'], 400);
        }

        $usuario = Usuario::findOrFail($id);
        $usuario->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso']);
    }
}