<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Depoimento;
use Illuminate\Support\Facades\Validator;

class DepoimentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $depoimentos = Depoimento::orderBy('created_at', 'desc')->get();
        return response()->json($depoimentos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
 public function store(Request $request)
{
  $validator = Validator::make($request->all(),[
   'experiencia' => 'required|string',
    'imagem_url' => 'nullable|string',
    'movimento' => 'nullable|string|max:255',
    'nome_autor' => 'nullable|string|max:255',
    'idade_autor' => 'nullable|integer',
    'usuario_id' => 'nullable|integer|exists:usuarios,id',
  ]);
     if($validator->fails()){
    return response()->json([
        'errors' => $validator->errors()
    ], 422);
  }
   $depoimentos = Depoimento::create([
    'experiencia' => $request->experiencia,
    'imagem_url' => $request->imagem_url,
    'movimento' => $request->movimento,
    'nome_autor' => $request->nome_autor,
    'idade_autor' => $request->idade_autor,
    'usuario_id' => $request->user()->id,
  ]);
  return response()->json($depoimentos, 201);
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
   public function destroy($id){
        $depoimento = Depoimento::find($id);
        if(!$depoimento){
            return response()->json(['message' => 'Usuario nao encontrado'], 404);
        }
        $depoimento->delete();
        return response()->json(['message' => 'Usuario deletado com sucesso'], 200);
    }


    public function indexAdmin()
    {
        $depoimentos = \App\Models\Depoimento::with('usuario')->get();
        return response()->json($depoimentos);    
    }
}
