<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $fillable = [
        'nome',
        'email',
        'senha',
        'is_admin',
        'foto_perfil_url',
        'bio',
        'versiculo_favorito',
        'cidade',
    ];

    /**
     * Campos ocultos
     */
    protected $hidden = [
        'senha',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Sobrescreve a senha ao criar/atualizar
     */
    public function setSenhaAttribute($value)
    {
        $this->attributes['senha'] = Hash::make($value);
    }

    /**
     * Para o Auth usar o campo 'senha' ao invés de 'password'
     */
    public function getAuthPassword()
    {
        return $this->senha;
    }
}
