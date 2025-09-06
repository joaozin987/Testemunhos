<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'email',
        'senha',
        'foto_perfil_url',
        'bio',
        'versiculo_favorito',
        'cidade',
        'reset_token',
        'reset_token_expires',
    ];
}
