<?php

namespace App\Models;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;
use Illuminate\Contracts\Auth\CanResetPassword;
use Illuminate\Auth\Passwords\CanResetPassword as CanResetPasswordTrait;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;
class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, CanResetPasswordTrait;

    /**
     * Campos que podem ser preenchidos em massa
     */
    protected $table = 'usuarios';
    protected $fillable = [
        'nome',
        'email',
        'senha',
        'is_admin',
        'foto_perfil_url',
        'upload_file',
        'bio',
        'versiculo_favorito',
        'cidade',
    ];


    /**
     * Campos ocultos
     */
    protected $hidden = [
        'senha',
        'remember_token',
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
