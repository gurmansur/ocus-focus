import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Colaborador } from '../entities/colaborador.entity';

/**
 * Repositório de colaboradores que estende o repositório base
 * Implementa métodos específicos para a entidade Colaborador
 */
@Injectable()
export class ColaboradorRepository extends BaseRepository<Colaborador> {
  constructor(
    @InjectRepository(Colaborador)
    private readonly colaboradorRepo: Repository<Colaborador>,
  ) {
    super(colaboradorRepo);
  }

  /**
   * Cria um novo colaborador com usuário opcional
   * @param data Dados do colaborador
   * @param usuario Usuário associado (opcional)
   * @returns O colaborador criado
   */
  async createWithUsuario(
    data: Partial<Colaborador>,
    usuario?: Usuario,
  ): Promise<Colaborador> {
    const colaborador = this.colaboradorRepo.create(data);
    colaborador.usuario = usuario;
    return await this.colaboradorRepo.save(colaborador);
  }

  /**
   * Busca colaboradores por projeto
   * @param projetoId ID do projeto
   * @returns Lista de colaboradores do projeto
   */
  async findByProjeto(projetoId: number): Promise<Colaborador[]> {
    return await this.colaboradorRepo.find({
      where: {
        projetos: { id: projetoId },
      },
    });
  }

  /**
   * Busca colaboradores filtrados por nome e/ou projeto
   * @param nome Nome para filtrar (opcional)
   * @param projetoId ID do projeto para filtrar (opcional)
   * @param page Número da página (opcional)
   * @param pageSize Tamanho da página (opcional)
   * @returns Colaboradores paginados e filtrados
   */
  async findAllFilteredPaginated(
    nome?: string,
    projetoId?: number,
    page?: number,
    pageSize?: number,
  ): Promise<any> {
    // Busca colaboradores no projeto
    const inProject = await this.colaboradorRepo.find({
      where: {
        projetos: projetoId ? { projeto: { id: projetoId } } : undefined,
      },
    });

    // Busca colaboradores não presentes no projeto, com filtro de nome opcional
    if (!page || !pageSize) {
      const notInProject = await this.colaboradorRepo.find({
        where: {
          id: Not(In(inProject.map((colaborador) => colaborador.id))),
          nome: nome ? Like(`%${nome}%`) : undefined,
        },
      });

      return notInProject;
    }

    // Define pagination parameters
    const take = pageSize || 10;
    const skip = page ? (page - 1) * take : 0;

    // Retorna paginado
    const [items, total] = await this.colaboradorRepo.findAndCount({
      where: {
        id: Not(In(inProject.map((colaborador) => colaborador.id))),
        nome: nome ? Like(`%${nome}%`) : undefined,
      },
      skip: skip,
      take: take,
    });

    return {
      items,
      page: {
        size: take,
        totalElements: total,
        totalPages: Math.ceil(total / take),
        number: page || 1,
      },
    };
  }

  /**
   * Busca um colaborador pelo email
   * @param email Email do colaborador
   * @returns O colaborador encontrado ou null
   */
  async findByEmail(email: string): Promise<Colaborador | null> {
    return await this.colaboradorRepo.findOne({ where: { email } });
  }

  /**
   * Busca colaboradores por projeto com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Colaboradores paginados do projeto
   */
  async findByProjetoPaginated(
    projetoId: number,
    page: number,
    pageSize: number
  ): Promise<any> {
    // Define pagination parameters
    const take = pageSize || 10;
    const skip = page ? (page - 1) * take : 0;

    // Query collaborators with pagination
    const [items, total] = await this.colaboradorRepo.findAndCount({
      where: {
        projetos: { projeto: { id: projetoId } },
      },
      skip: skip,
      take: take,
    });

    return {
      items,
      page: {
        size: take,
        totalElements: total,
        totalPages: Math.ceil(total / take),
        number: page || 1,
      },
    };
  }
}
