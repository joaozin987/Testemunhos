// src/user/dto/update-user.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O campo nome não pode estar vazio.' })
  @IsOptional() 
  nome?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsString()
  @IsOptional()
  versiculo_favorito?: string;

  @IsString()
  @IsOptional()
  cidade?: string;
}