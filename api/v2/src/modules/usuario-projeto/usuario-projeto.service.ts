import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Projeto } from '../projeto/entities/projeto.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { UserRole } from '../usuario/enums/user-role.enum';
import { UsuarioProjeto } from './entities/usuario-projeto.entity';

@Injectable()
export class UsuarioProjetoService {
  constructor(
    @InjectRepository(UsuarioProjeto)
    private readonly usuarioProjetoRepository: Repository<UsuarioProjeto>,
  ) {}

  async create({
    usuarioId,
    projetoId,
    role,
    administrador = false,
  }: {
    usuarioId: number;
    projetoId: number;
    role: UserRole;
    administrador?: boolean;
  }): Promise<UsuarioProjeto> {
    const usuario = new Usuario();
    usuario.id = usuarioId;

    const projeto = new Projeto();
    projeto.id = projetoId;

    const usuarioProjeto = this.usuarioProjetoRepository.create({
      usuario,
      projeto,
      role,
      administrador,
      ativo: true,
    });

    return this.usuarioProjetoRepository.save(usuarioProjeto);
  }

  async findByUsuarioAndProjeto(
    usuarioId: number,
    projetoId: number,
  ): Promise<UsuarioProjeto | null> {
    return this.usuarioProjetoRepository.findOne({
      where: {
        usuario: { id: usuarioId },
        projeto: { id: projetoId },
      },
      relations: ['usuario', 'projeto'],
    });
  }

  async findByProjeto(projetoId: number): Promise<UsuarioProjeto[]> {
    return this.usuarioProjetoRepository.find({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['usuario', 'projeto'],
    });
  }

  async findByUsuario(usuarioId: number): Promise<UsuarioProjeto[]> {
    return this.usuarioProjetoRepository.find({
      where: {
        usuario: { id: usuarioId },
      },
      relations: ['usuario', 'projeto'],
    });
  }

  async update(id: number, updates: Partial<UsuarioProjeto>): Promise<void> {
    await this.usuarioProjetoRepository.update(id, updates);
  }

  async remove(id: number): Promise<void> {
    await this.usuarioProjetoRepository.delete(id);
  }

  async removeByProjetoAndUsuario(
    projetoId: number,
    usuarioId: number,
  ): Promise<void> {
    await this.usuarioProjetoRepository.delete({
      projeto: { id: projetoId },
      usuario: { id: usuarioId },
    });
  }

  async findUsuariosByProjetoId(
    projetoId: number,
    page?: number,
    pageSize?: number,
  ): Promise<UsuarioProjeto[]> {
    const queryBuilder = this.usuarioProjetoRepository
      .createQueryBuilder('usuarioProjeto')
      .leftJoinAndSelect('usuarioProjeto.usuario', 'usuario')
      .where('usuarioProjeto.projeto.id = :projetoId', { projetoId });

    if (page !== undefined && pageSize !== undefined) {
      queryBuilder.skip(page * pageSize).take(pageSize);
    }

    return queryBuilder.getMany();
  }

  async findUsuariosByNome(
    projetoId: number,
    nome: string,
    page: number,
    pageSize: number,
  ): Promise<UsuarioProjeto[]> {
    return this.usuarioProjetoRepository
      .createQueryBuilder('usuarioProjeto')
      .leftJoinAndSelect('usuarioProjeto.usuario', 'usuario')
      .where('usuarioProjeto.projeto.id = :projetoId', { projetoId })
      .andWhere('LOWER(usuario.nome) LIKE LOWER(:nome)', {
        nome: `%${nome}%`,
      })
      .skip(page * pageSize)
      .take(pageSize)
      .getMany();
  }

  async countUsersOnProject(projetoId: number): Promise<number> {
    return this.usuarioProjetoRepository.count({
      where: {
        projeto: { id: projetoId },
      },
    });
  }
}
