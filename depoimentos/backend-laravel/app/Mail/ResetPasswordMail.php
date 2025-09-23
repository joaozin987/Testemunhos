<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public $url;

    /**
     * Create a new message instance.
     */
    public function __construct($url)
    {
        $this->url = $url;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Redefinição de Senha')
            ->html("
                <h1>Redefinição de senha: Conectados-pela-fe</h1>
                <p>Você solicitou a redefinição da sua senha.</p>
                <p>Para nao esquecer novamente, tente anotar sua nova senha e guardar-la em algum local seguro!</p>
                <p>Clique no link abaixo para criar uma nova senha:</p>
                <p><a href='{$this->url}'>{$this->url}</a></p>
                <br>
                <p>Esse link tem 60 segundos até ser expirado</p>
                <p>Se não foi você que solicitou, ignore este e-mail.</p>
            ");
    }
}
