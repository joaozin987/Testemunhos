// src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // No construtor, configuramos o "transportador" do Nodemailer
    // Ele usa as credenciais do seu arquivo .env
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  /**
   * Envia o e-mail de recuperação de senha.
   * @param email O e-mail do destinatário.
   * @param token O token único para redefinição.
   */
  async sendPasswordResetEmail(email: string, token: string) {
    // Busca a URL do seu frontend no arquivo .env para montar o link
    const frontendURL = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendURL}/redefinir-senha/${token}`;

    // Usa o transportador configurado para enviar o e-mail
    await this.transporter.sendMail({
      from: `"Conectados pela Fé" <${this.configService.get<string>('EMAIL_USER')}>`,
      to: email,
      subject: 'Redefinição de Senha - Conectados pela Fé',
      html: `
        <p>Olá,</p>
        <p>Você solicitou a redefinição da sua senha. Clique no link abaixo para criar uma nova senha:</p>
        <p><a href="${resetLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Redefinir Senha</a></p>
        <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>
        <br>
        <p>Atenciosamente,</p>
        <p>Equipe Conectados pela Fé</p>
      `,
    });
  }
}