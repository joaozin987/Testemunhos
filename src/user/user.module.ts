// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { DatabaseModule } from '../config/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    DatabaseModule, // Para que o UsersService possa acessar o banco de dados.
    AuthModule,     // Para garantir que as estratégias de autenticação estejam disponíveis para os Guards.
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UsersModule {}