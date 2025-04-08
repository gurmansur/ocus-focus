import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { BaseRepository } from '../../../common/repositories/base.repository';
import { createPaginatedResponse } from '../../../common/utils/pagination.util';
import { PaginatedResult } from '../../../interfaces/paginated-result.interface';
import { CasoDeTesteMapper } from '../caso-de-teste.mapper';
import { CasoDeTeste } from '../entities/caso-de-teste.entity';

/**
 * Repositório para a entidade CasoDeTeste
 * Implementa operações específicas para gerenciamento de casos de teste
 */
@Injectable()
export class CasoDeTesteRepository extends BaseRepository<CasoDeTeste> {
  constructor(
    @InjectRepository(CasoDeTeste)
    private readonly casoDeTesteRepo: Repository<CasoDeTeste>,
  ) {
    super(casoDeTesteRepo);
  }

  /**
   * Encontra casos de teste por projeto
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de casos de teste
   */
  async findByProjeto(
    projetoId: number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const [items, total] = await this.casoDeTesteRepo.findAndCount({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['projeto', 'cenarios', 'suitesDeTeste'],
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return createPaginatedResponse(items, total, page, pageSize);
  }

  /**
   * Encontra casos de teste por nome
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de casos de teste
   */
  async findByNome(
    nome: string,
    projetoId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<any>> {
    const skip = page * pageSize;
    const take = pageSize;

    const [result, total] = await this.casoDeTesteRepo.findAndCount({
      where: {
        projeto: { id: projetoId },
        nome: Like(`%${nome}%`),
      },
      relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso', 'projeto'],
      skip,
      take,
    });

    const items = result.map((item) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(item),
    );

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: +pageSize,
        totalPages: Math.ceil(total / +pageSize),
        currentPage: +page,
      },
    };
  }

  /**
   * Encontra casos de teste por suite de teste
   * @param suiteDeTesteId ID da suite de teste
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de casos de teste
   */
  async findBySuiteDeTeste(
    suiteDeTesteId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<any>> {
    const skip = page * pageSize;
    const take = pageSize;

    const [result, total] = await this.casoDeTesteRepo.findAndCount({
      where: {
        suiteDeTeste: { id: suiteDeTesteId },
      },
      relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso', 'projeto'],
      skip,
      take,
    });

    const items = result.map((item) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(item),
    );

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: +pageSize,
        totalPages: Math.ceil(total / +pageSize),
        currentPage: +page,
      },
    };
  }

  /**
   * Busca um caso de teste por ID com todas as relações
   * @param id ID do caso de teste
   * @returns O caso de teste encontrado ou null
   */
  async findByIdWithRelations(id: number): Promise<CasoDeTeste | null> {
    return await this.casoDeTesteRepo.findOne({
      where: { id },
      relations: ['projeto', 'cenarios', 'suitesDeTeste'],
    });
  }

  async findAllPaginated(
    projetoId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<any>> {
    const skip = page * pageSize;
    const take = pageSize;

    const [result, total] = await this.casoDeTesteRepo.findAndCount({
      where: {
        projeto: { id: projetoId },
      },
      relations: ['testadorDesignado', 'suiteDeTeste', 'casoDeUso', 'projeto'],
      skip,
      take,
    });

    const items = result.map((item) =>
      CasoDeTesteMapper.entityToCasoDeTesteBo(item),
    );

    return {
      items,
      meta: {
        totalItems: total,
        itemCount: items.length,
        itemsPerPage: +pageSize,
        totalPages: Math.ceil(total / +pageSize),
        currentPage: +page,
      },
    };
  }
}
