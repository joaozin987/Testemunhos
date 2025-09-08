<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function login(Request $request)
    {
       
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'senha' => 'required|string',
            ]);
            
            $usuario = Usuario::where('email', $credentials['email'])->first();
         
            if(!$usuario || !Hash::check($credentials['senha'], $usuario->senha)){
                return response()->json([
                    'message' => 'Credenciais inválidas.'
                ], 401);
            }
            
            // Cria o token usando Sanctum
            $token = $usuario->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Login realizado com sucesso',
                'usuario' => $usuario,
                'access_token' => $token,
                'token_type' => 'Bearer'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro no servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            // Revoga o token atual do usuário
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'message' => 'Logout realizado com sucesso'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erro no logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}