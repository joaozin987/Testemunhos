// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
// import { Request } from 'express'; // Não precisamos mais desta linha com o 'any'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // A MUDANÇA ESTÁ AQUI 👇
        (request: any) => {
          // Dizemos ao TypeScript para não se preocupar com o tipo do 'request'
          // e apenas tentar acessar a propriedade 'cookies.token'.
          return request?.cookies?.token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),

      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: { id: number; nome: string }) {
    if (!payload || !payload.id) {
      throw new UnauthorizedException('Token inválido.');
    }
    return { id: payload.id, nome: payload.nome };
  }
}