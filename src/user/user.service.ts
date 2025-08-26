// src/user/user.service.ts
import { Injectable, Inject, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from '../config/database.module';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject(PG_CONNECTION) private readonly pool: Pool) {}

  /**
   * Busca os dados de perfil de um usuário pelo ID.
   */
  async findProfile(userId: number) {
    try {
      const profileResult = await this.pool.query(
        'SELECT id, nome, email, foto_perfil_url, bio, versiculo_favorito, cidade FROM usuarios WHERE id = $1',
        [userId],
      );

      if (profileResult.rows.length === 0) {
        throw new NotFoundException('Perfil de usuário não encontrado.');
      }
      return profileResult.rows[0];
    } catch (error) {
      // Se o erro já for o que lançamos, apenas o propague
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro ao buscar perfil:', error);
      throw new InternalServerErrorException('Erro interno ao buscar dados do perfil.');
    }
  }

  /**
   * Atualiza os dados de perfil de um usuário.
   * A query é montada dinamicamente para atualizar apenas os campos enviados.
   */
  async updateProfile(userId: number, updateUserDto: UpdateUserDto) {
    const fieldsToUpdate = Object.entries(updateUserDto)
      .filter(([key, value]) => value !== undefined && value !== null);

    if (fieldsToUpdate.length === 0) {
      // Se nada for enviado para atualizar, apenas retorna o perfil atual.
      return this.findProfile(userId);
    }
    
    // Monta a query dinamicamente, igual ao seu código Express
    const setClause = fieldsToUpdate
      .map(([key], index) => `${key} = $${index + 1}`)
      .join(', ');
      
    const values = fieldsToUpdate.map(([, value]) => value);
    values.push(userId); // Adiciona o ID do usuário para a cláusula WHERE

    const query = `
      UPDATE usuarios 
      SET ${setClause} 
      WHERE id = $${values.length} 
      RETURNING id, nome, email, foto_perfil_url, bio, versiculo_favorito, cidade
    `;

    try {
      const result = await this.pool.query(query, values);
      if (result.rowCount === 0) {
        throw new NotFoundException('Usuário não encontrado para atualizar.');
      }
      return result.rows[0];
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('Erro ao atualizar perfil:', error);
      throw new InternalServerErrorException('Erro interno ao atualizar perfil.');
    }
  }
}