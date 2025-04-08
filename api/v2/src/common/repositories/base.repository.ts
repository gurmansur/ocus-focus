import { Injectable } from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, Repository } from 'typeorm';

/**
 * Repositório base que fornece operações comuns para entidades
 * Implementa o padrão Repository para melhorar a estrutura do código
 */
@Injectable()
export abstract class BaseRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  /**
   * Cria uma nova entidade
   * @param data Dados da entidade a ser criada
   * @returns A nova entidade criada
   */
  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity as any);
  }

  /**
   * Busca todas as entidades
   * @returns Lista de entidades
   */
  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  /**
   * Busca uma entidade pelo ID
   * @param id ID da entidade
   * @returns A entidade encontrada ou null
   */
  async findById(id: number | string): Promise<T | null> {
    return await this.repository.findOneBy({ id } as unknown as FindOptionsWhere<T>);
  }

  /**
   * Atualiza uma entidade
   * @param id ID da entidade
   * @param data Dados a serem atualizados
   * @returns A entidade atualizada
   */
  async update(id: number | string, data: DeepPartial<T>): Promise<T> {
    await this.repository.update(id as any, data as any);
    return await this.findById(id);
  }

  /**
   * Remove uma entidade
   * @param id ID da entidade
   * @returns Resultado da operação
   */
  async remove(id: number | string): Promise<boolean> {
    const result = await this.repository.delete(id as any);
    return result.affected > 0;
  }

  /**
   * Busca entidades com paginação
   * @param options Opções de busca
   * @param page Número da página
   * @param limit Limite de itens por página
   * @returns Dados paginados
   */
  async findWithPagination(
    options: FindOptionsWhere<T>,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    items: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const [items, total] = await this.repository.findAndCount({
      where: options,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }
} 