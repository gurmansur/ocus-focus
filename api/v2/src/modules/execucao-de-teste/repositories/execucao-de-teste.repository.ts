import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginatedResult } from '../../../interfaces/paginated-result.interface';
import { ExecucaoDeTeste } from '../entities/execucao-de-teste.entity';
import { ExecucaoDeTesteMapper } from '../execucao-de-teste.mapper';

@Injectable()
export class ExecucaoDeTesteRepository {
  constructor(
    @InjectRepository(ExecucaoDeTeste)
    private readonly repository: Repository<ExecucaoDeTeste>,
  ) {}

  /**
   * Busca execuções de teste por nome com paginação
   * @param nome Nome para filtrar
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de execuções de teste
   */
  async findByNome(
    nome: string,
    projetoId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<any>> {
    const skip = page * pageSize;
    const take = pageSize;

    // Using query builder to allow searching by description
    const [result, total] = await this.repository
      .createQueryBuilder('execucao')
      .innerJoinAndSelect('execucao.casoDeTeste', 'casoDeTeste')
      .innerJoinAndSelect('casoDeTeste.projeto', 'projeto')
      .leftJoinAndSelect('casoDeTeste.testadorDesignado', 'testadorDesignado')
      .where('execucao.nome LIKE :nome', { nome: `%${nome}%` })
      .andWhere('projeto.id = :projetoId', { projetoId })
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const items = result.map((item) => ExecucaoDeTesteMapper.entityToBo(item));

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
   * Busca execuções de teste por caso de teste com paginação
   * @param casoDeTesteId ID do caso de teste
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de execuções de teste
   */
  async findByCasoDeTeste(
    casoDeTesteId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<any>> {
    const skip = page * pageSize;
    const take = pageSize;

    const [result, total] = await this.repository.findAndCount({
      where: {
        casoDeTeste: { id: casoDeTesteId },
      },
      relations: [
        'casoDeTeste',
        'casoDeTeste.projeto',
        'casoDeTeste.testadorDesignado',
      ],
      skip,
      take,
    });

    const items = result.map((item) => ExecucaoDeTesteMapper.entityToBo(item));

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
   * Busca execuções de teste por projeto com paginação
   * @param projetoId ID do projeto
   * @param page Número da página
   * @param pageSize Tamanho da página
   * @returns Lista paginada de execuções de teste
   */
  async findAllPaginated(
    projetoId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<any>> {
    const skip = page * pageSize;
    const take = pageSize;

    const [result, total] = await this.repository.findAndCount({
      where: {
        casoDeTeste: {
          projeto: { id: projetoId },
        },
      },
      relations: [
        'casoDeTeste',
        'casoDeTeste.projeto',
        'casoDeTeste.testadorDesignado',
      ],
      skip,
      take,
    });

    const items = result.map((item) => ExecucaoDeTesteMapper.entityToBo(item));

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
