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
    return response()->json([
        'usuario' => $request->user()
    ]);
}
    public function atualizarPerfil(Request $request)
{
    try {
        Log::info('Iniciando atualização de perfil', ['user_id' => $request->user()->id]);

        $validated = $request->validate([
            'nome' => 'nullable|string|max:255',
            'cidade' => 'nullable|string',
            'upload_file' => 'nullable|image|mimes:jpg,jpeg,png,gif,webp|max:4096',
            'bio' => 'nullable|string',
            'versiculo_favorito' => 'nullable|string',
        ]);

        $usuario = $request->user();

        Log::info('Dados validados', $validated);

        if ($request->hasFile('upload_file')) {
            $file = $request->file('upload_file');
            Log::info('Arquivo recebido', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);

            if ($file->isValid()) {
                Log::info('Arquivo é válido');

                // Deletar imagem anterior se existir
                if ($usuario->upload_file) {
                    $oldImagePath = str_replace('/storage/', '', $usuario->upload_file);
                    if (Storage::disk('public')->exists($oldImagePath)) {
                        Storage::disk('public')->delete($oldImagePath);
                        Log::info('Imagem anterior deletada', ['path' => $oldImagePath]);
                    }
                }

                $fileName = 'user_' . $usuario->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('perfis', $fileName, 'public');
                Log::info('Arquivo armazenado', ['path' => $path]);

                $usuario->upload_file = '/storage/' . $path;
                Log::info('Novo caminho da imagem', ['upload_file' => $usuario->upload_file]);
            } else {
                Log::error('Arquivo inválido');
            }
        } else {
            Log::info('Nenhum arquivo de imagem foi enviado');
        }

        $usuario->nome = $request->input('nome', $usuario->nome);
        $usuario->cidade = $request->input('cidade', $usuario->cidade);
        $usuario->bio = $request->input('bio', $usuario->bio);
        $usuario->versiculo_favorito = $request->input('versiculo_favorito', $usuario->versiculo_favorito);
        $usuario->save();

        Log::info('Perfil atualizado com sucesso');

        return response()->json([
            'mensagem' => 'Perfil atualizado com sucesso!',
            'usuario' => $usuario
        ]);

    } catch (\Exception $e) {
        Log::error('Erro ao atualizar perfil', [
            'user_id' => $request->user()->id ?? 'unknown',
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'mensagem' => 'Erro interno: ' . $e->getMessage()
        ], 500);
    }
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
        'senha' => $request->password, // Mutator já aplica Hash::make
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