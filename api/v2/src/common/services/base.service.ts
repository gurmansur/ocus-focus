import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from '../repositories/base.repository';
import { Messages } from '../constants/messages.constant';

/**
 * Serviço base que fornece operações CRUD comuns
 * Implementa o padrão Service para separar a lógica de negócio
 */
export abstract class BaseService<T> {
  /**
   * Entidade sendo manipulada pelo serviço
   */
  protected abstract readonly entityName: string;

  constructor(protected readonly repository: BaseRepository<T>) {}

  /**
   * Cria uma nova entidade
   * @param createDto Dados para criação
   * @returns A entidade criada
   */
  async create(createDto: any): Promise<T> {
    return this.repository.create(createDto);
  }

  /**
   * Encontra uma entidade pelo ID
   * @param id ID da entidade
   * @returns A entidade encontrada
   * @throws NotFoundException se a entidade não for encontrada
   */
  async findById(id: number): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException(Messages.NOT_FOUND(this.entityName, id));
    }
    return entity;
  }

  /**
   * Busca todas as entidades
   * @returns Lista de entidades
   */
  async findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  /**
   * Atualiza uma entidade
   * @param id ID da entidade
   * @param updateDto Dados para atualização
   * @returns A entidade atualizada
   * @throws NotFoundException se a entidade não for encontrada
   */
  async update(id: number, updateDto: any): Promise<T> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(Messages.NOT_FOUND(this.entityName, id));
    }
    
    return this.repository.update(id, updateDto);
  }

  /**
   * Remove uma entidade
   * @param id ID da entidade
   * @returns True se a operação foi bem-sucedida
   * @throws NotFoundException se a entidade não for encontrada
   */
  async remove(id: number): Promise<boolean> {
    const entity = await this.findById(id);
    if (!entity) {
      throw new NotFoundException(Messages.NOT_FOUND(this.entityName, id));
    }
    
    return this.repository.remove(id);
  }
} 