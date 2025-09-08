<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Model
{
    use HasFactory, HasApiTokens;

    protected $fillable = [
        'nome', 
        'email', 
        'senha',
        'is_admin',
        'foto_perfil_url',
        'bio',
        'versiculo_favorito', 
        'cidade'
    ];

    protected $hidden = [
        'senha',
    ];

   public function setSenhaAttribute($value)
    {
        $this->attributes['senha'] = Hash::make($value);
    }

    public function getSenhaTextAttribute()
    {
       
        if (auth()->check() && auth()->user()->is_admin) {
            return $this->attributes['senha_plain'] ?? 'Senha não disponível';
        }
        
        return 'Acesso restrito';
    }
}