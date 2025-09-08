<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;

class AdminController extends Controller
{
    public function __construct()
    {
      
        $this->middleware(function ($request, $next) {
            if (!$request->user() || !$request->user()->is_admin) {
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

    
    public function makeAdmin($id)
    {
        $usuario = Usuario::findOrFail($id);
        $usuario->is_admin = true;
        $usuario->save();

        return response()->json([
            'message' => 'Usuário promovido a administrador com sucesso',
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