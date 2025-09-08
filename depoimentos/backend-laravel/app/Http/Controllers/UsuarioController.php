<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Usuario::all();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
  public function store(Request $request)
{
    $validatedData = $request->validate([
        'nome' => 'required|string',
        'email' => 'required|email|unique:usuarios,email',
        'senha' => 'required|string|min:8',
    ], [
        'senha.min' => 'A senha deve ter no mínimo 8 caracteres.',
        'email.unique' => 'Esse email já foi cadastrado!',
    ]);

    $usuario = Usuario::create([
        'nome' => $validatedData['nome'],
        'email' => $validatedData['email'],
        'senha' => Hash::make($validatedData['senha']), // CORREÇÃO: Use Hash::make()
    ]);

    return response()->json($usuario, 201);
}
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
