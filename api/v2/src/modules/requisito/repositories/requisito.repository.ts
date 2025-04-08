import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { CreateRequisitoDto } from '../dto/create-requisito.dto';
import { UpdateRequisitoDto } from '../dto/update-requisito.dto';
import { Requisito } from '../entities/requisito.entity';

/**
 * Repositório de requisitos
 * Implementa operações específicas para a entidade Requisito
 */
@Injectable()
export class RequisitoRepository extends BaseRepository<Requisito> {
  constructor(
    @InjectRepository(Requisito)
    private readonly requisitoRepo: Repository<Requisito>,
  ) {
    super(requisitoRepo);
  }

  /**
   * Cria um novo requisito associado a um projeto
   * @param createRequisitoDto Dados do requisito
   * @param projeto Projeto associado
   * @returns O requisito criado
   */
  async createWithProjeto(
    createRequisitoDto: CreateRequisitoDto,
    projeto: Projeto,
  ): Promise<Requisito> {
    const requisito = this.requisitoRepo.create(createRequisitoDto);
    requisito.projeto = projeto;
    return await this.requisitoRepo.save(requisito);
  }

  /**
   * Lista requisitos de um projeto com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de requisitos
   */
  async listByProjetoWithPagination(
    projetoId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{
    items: Requisito[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const [items, total] = await this.requisitoRepo.findAndCount({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['projeto'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      limit: pageSize,
      pages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Lista requisitos filtrados por nome com paginação
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de requisitos
   */
  async listByNomeWithPagination(
    nome: string,
    projetoId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{
    items: Requisito[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const [items, total] = await this.requisitoRepo.findAndCount({
      where: {
        nome: Like(`%${nome}%`),
        projeto: { id: projetoId },
      },
      relations: ['projeto'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items,
      total,
      page,
      limit: pageSize,
      pages: Math.ceil(total / pageSize),
    };
  }

  /**
   * Busca um requisito pelo ID com relações
   * @param id ID do requisito
   * @returns O requisito encontrado ou null
   */
  async findByIdWithRelations(id: number): Promise<Requisito | null> {
    return await this.requisitoRepo.findOne({
      where: { id },
      relations: ['projeto'],
    });
  }

  /**
   * Atualiza um requisito com verificação de projeto
   * @param id ID do requisito
   * @param updateRequisitoDto Dados a serem atualizados
   * @param projetoId ID do projeto para verificar
   * @returns O requisito atualizado
   */
  async updateWithProjetoCheck(
    id: number,
    updateRequisitoDto: UpdateRequisitoDto,
    projetoId: number,
  ): Promise<Requisito> {
    // Verifica se o requisito pertence ao projeto
    const requisito = await this.requisitoRepo.findOne({
      where: {
        id,
        projeto: { id: projetoId },
      },
    });

    if (!requisito) {
      return null;
    }

    await this.requisitoRepo.update(id, updateRequisitoDto);
    return await this.findByIdWithRelations(id);
  }
}
