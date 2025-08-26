import { 
  Injectable, 
  Inject, 
  UnauthorizedException, 
  ConflictException, 
  BadRequestException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../config/database.module'; 
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PG_CONNECTION) private readonly pool: Pool,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { nome, email, senha } = registerDto;
    
    if (!email.endsWith('@gmail.com')) {
      throw new BadRequestException('Cadastro permitido apenas para e-mails do Gmail.');
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      const newUserQuery = await this.pool.query(
        'INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome, email',
        [nome, email, senhaHash],
      );
      return newUserQuery.rows[0];
    } catch (error) {
      if (error.code === '23505') { 
        throw new ConflictException('O e-mail informado já foi cadastrado.');
      }
      throw new InternalServerErrorException('Ocorreu um erro inesperado ao registrar.');
    }
  }

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;
    
    const userResult = await this.pool.query(
      'SELECT id, nome, senha_hash FROM usuarios WHERE email = $1',
      [email],
    );

    if (userResult.rows.length === 0) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(senha, user.senha_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const payload = { id: user.id, nome: user.nome };
    const token = this.jwtService.sign(payload);

    return { message: 'Login bem-sucedido!', token };
  }

  async requestPasswordReset(email: string) {
    const userResult = await this.pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 3600000); // Token expira em 1 hora

      await this.pool.query(
        'UPDATE usuarios SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
        [token, expires, email],
      );
      
      await this.mailService.sendPasswordResetEmail(email, token);
    }
    
    return { message: 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.' };
  }

  async resetPassword(token: string, novaSenha: string) {
    const userResult = await this.pool.query(
        'SELECT id FROM usuarios WHERE reset_token = $1 AND reset_token_expires > NOW()',
        [token],
    );
    if (userResult.rows.length === 0) {
        throw new BadRequestException('Token inválido ou expirado.');
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(novaSenha, salt);

    await this.pool.query(
        'UPDATE usuarios SET senha_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
        [senhaHash, userResult.rows[0].id],
    );

    return { message: 'Senha redefinida com sucesso!' };
  }
}