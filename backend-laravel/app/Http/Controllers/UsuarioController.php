<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use App\Mail\ResetPasswordMail;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log; 

class UsuarioController extends Controller
{
    /**
     * Handle an authentication attempt.
     */
  public function perfil(Request $request)
{
    $usuario = $request->user();

    return response()->json([
        'usuario' => $usuario,
        'isAdmin' => $usuario->role === 1 
    ]);
}

   public function atualizarPerfil(Request $request)
{
    $usuario = $request->user();

    $usuario->nome = $request->nome;
    $usuario->cidade = $request->cidade;
    $usuario->bio = $request->bio;
    $usuario->versiculo_favorito = $request->versiculo_favorito;

    if ($request->hasFile('upload_file')) {
        $file = $request->file('upload_file');

        $nomeArquivo = time() . '_' . $file->getClientOriginalName();

        $file->storeAs('public/perfil', $nomeArquivo);

        $usuario->upload_file = "/storage/perfil/" . $nomeArquivo;
    }

    $usuario->save();

    return response()->json([
        'mensagem' => 'Perfil atualizado com sucesso!',
        'usuario' => $usuario
    ]);
}
public function register(Request $request)
{
    try {
        $request->validate([
            'nome' => 'required|string|max:255',
            'email' => 'required|email|unique:usuarios,email',
            'password' => 'required|min:6',
        ]);

        $usuario = Usuario::create([
            'nome' => $request->nome,
            'email' => $request->email,
            'senha' => $request->password,
            'role' => 0, 
        ]);

        $token = $usuario->createToken('API Token')->plainTextToken;

        return response()->json([
            'mensagem' => 'Usuário cadastrado com sucesso!',
            'usuario' => [
                'id' => $usuario->id,
                'nome' => $usuario->nome,
                'email' => $usuario->email,
                'is_admin' => $usuario->role === 1,
            ],
            'token' => $token
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'erro' => 'Erro ao registrar usuário',
            'detalhe' => $e->getMessage()
        ], 500);
    }
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
        'usuario' => [
            'id' => $usuario->id,
            'nome' => $usuario->nome,
            'email' => $usuario->email,
            'is_admin' => (bool) $usuario->is_admin,
            'upload_file' => $usuario->upload_file,
            'cidade' => $usuario->cidade,
            'bio' => $usuario->bio,
        ],
        'token' => $token
    ]);
}


    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);
        
        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) {
              $frontendUrl = "https://conectados-pela-fe.onrender.com/#/redefinir-senha?token=$token&email={$user->email}";
                Mail::to($user->email)->send(new ResetPasswordMail($frontendUrl));
            }
        );
        
        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['message' => 'Link enviado com sucesso!']);
        }
        
        return response()->json(['message' => 'Erro ao enviar link'], 500);
    }

 public function resetPassword(Request $request): JsonResponse
{
    $request->validate([
        'token' => 'required|string',
        'email' => 'required|email',
        'password' => 'required|min:6|confirmed',
    ]);

    try {
        Log::info('Reset de senha - Início:', ['email' => $request->email]);

        $user = Usuario::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado'], 400);
        }

      
        $user->update([
            'senha' => $request->password
        ]);

        Log::info('Reset de senha - Sucesso:', ['email' => $request->email]);

        return response()->json(['message' => 'Senha redefinida com sucesso!']);

    } catch (\Exception $e) {
        Log::error('Reset de senha - Erro:', [
            'email' => $request->email,
            'error' => $e->getMessage()
        ]);
        
        return response()->json(['message' => 'Erro ao redefinir senha'], 500);
    }
}

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out.'
        ]);
    }
}