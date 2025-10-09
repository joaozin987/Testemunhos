<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VersiculoController extends Controller
{
    public function buscar($palavra)
    {
        $token = env('BIBLIA_TOKEN'); 


        $response = Http::withHeaders([
            'Authorization' => "Bearer $token"
        ])->get("https://www.abibliadigital.com.br/api/verses/nvi/sl/30");

        if ($response->failed()) {
            return response()->json(['error' => 'Erro ao buscar na API'], 500);
        }

        $capitulo = $response->json();
        $versiculos = $capitulo['verses'] ?? [];

        $resultados = array_filter($versiculos, function ($v) use ($palavra) {
            return stripos($v['text'], $palavra) !== false;
        });

        return response()->json(array_values($resultados));
    }
}
