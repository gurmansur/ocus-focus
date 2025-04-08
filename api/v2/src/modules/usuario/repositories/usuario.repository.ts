import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Usuario } from '../entities/usuario.entity';

/**
 * Repositório para a entidade Usuario
 * Implementa operações específicas para gerenciamento de usuários
 */
@Injectable()
export class UsuarioRepository extends BaseRepository<Usuario> {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {
    super(usuarioRepo);
  }

  /**
   * Busca um usuário por email
   * @param email Email do usuário
   * @returns O usuário encontrado ou null
   */
  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepo
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .getOne();
  }

  /**
   * Verifica se um email já está em uso
   * @param email Email a ser verificado
   * @returns True se o email já estiver em uso, False caso contrário
   */
  async emailExists(email: string): Promise<boolean> {
    const count = await this.usuarioRepo
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .getCount();
    return count > 0;
  }
}
