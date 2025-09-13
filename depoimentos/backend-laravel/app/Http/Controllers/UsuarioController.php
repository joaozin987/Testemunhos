<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;

class UsuarioController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
    public function perfil (Request $request)
      {
        return response()->json($request->user());

    }
   public function atualizarPerfil(Request $request)
{
      $request->validate([
        'nome' => 'nullable|string|max:255',
        'cidade' => 'nullable|string',
        'upload_file' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
        'bio' => 'nullable|string',
        'versiculo_favorito' => 'nullable|string',
    ]);

   
    $usuario = $request->user();

   if($request->hasFile('upload_file')){
    $path = $request->file('upload_file')->store('usuarios', 'public');
    $usuario->upload_file = $path;
   }
   $usuario->nome = $request->input('nome', $usuario->nome);
   $usuario->cidade = $request->input('cidade', $usuario->cidade);
   $usuario->bio = $request->input('bio', $usuario->bio);
   $usuario->versiculo_favorito = $request->input('versiculo_favorito', $usuario->versiculo_favorito);

   $usuario->save();
   
    return response()->json([
        'mensagem' => 'Perfil atualizado com sucesso!',
        'usuario' => $usuario
    ]);
}

    public function register(Request $request)
{
    $request->validate([
        'nome' => 'required|string|max:255',
        'email' => 'required|email|unique:usuarios,email',
        'password' => 'required|string|min:6',
    ]);

    $usuario = Usuario::create([
        'nome' => $request->nome,
        'email' => $request->email,
        'senha' => $request->password,
    ]);

    $token = $usuario->createToken('API Token')->plainTextToken;

    return response()->json([
        'mensagem' => 'Usuário criado com sucesso!',
        'usuario' => $usuario,
        'token' => $token
    ], 201);
}

   public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|string'
    ]);

    $usuario = Usuario::where('email', $request->email)->first();

    if (!$usuario || !Hash::check($request->password, $usuario->senha)) {
        return response()->json(['erro' => 'Credenciais inválidas'], 401);
    }


    $token = $usuario->createToken('API Token')->plainTextToken;

    return response()->json([
        'mensagem' => 'Login realizado com sucesso!',
        'usuario' => $usuario,
        'token' => $token
    ]);
}

    /**
     * Log the user out (revoke the token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.'
        ]);
    }
}
