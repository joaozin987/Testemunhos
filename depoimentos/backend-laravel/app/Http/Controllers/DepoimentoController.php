<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Depoimento;

class DepoimentoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Depoimento::all();
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
            'experiencia' => 'required|string',
            'movimento' => 'required|string',
            'imagem_url' => 'nullable|string',
            'nome_autor' => 'nullable|string',
            'idade_autor' => 'nullable|integer',
            'usuario_id' => 'nullable|exists:usuarios,id',
        ]);

        
        $depoimento = Depoimento::create($validatedData);

        return response()->json($depoimento, 201);
    
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
