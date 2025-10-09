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
    $usuario->isAdmin = (bool) $usuario->is_admin;
    return response()->json([
        'mensagem' => 'Login realizado com sucesso!',
        'usuario' => $usuario,
        'token' => $token,
        'isAdmin' => (bool) $usuario->is_admin,
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
            $frontendUrl = "http://localhost:5173/redefinir-senha?token=$token&email={$user->email}";
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
    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function (Usuario $user, string $password) {
            $user->forceFill([
                'senha' => Hash::make($password), 
            ])->setRememberToken(Str::random(60));
            $user->save();
        }
    );
    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Senha redefinida com sucesso'])
        : response()->json(['message' => 'Erro ao redefinir senha'], 400);
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
