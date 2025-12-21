import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

/**
 * BaseService - Template Method Pattern + DRY Principle
 * Provides common CRUD operations to prevent code duplication
 * Each service extends this for domain-specific logic only
 * Follows Single Responsibility: Each method has one reason to change
 */
@Injectable()
export abstract class BaseService<Entity, CreateDto, UpdateDto> {
  protected abstract repository: Repository<Entity>;

  /**
   * Create new entity - Override in subclasses for custom validation
   */
  async create(createDto: CreateDto): Promise<Entity> {
    const entity = this.repository.create(createDto as any);
    return (await this.repository.save(entity as any)) as Entity;
  }

  /**
   * Find all entities with optional filtering
   */
  async findAll(where?: any): Promise<Entity[]> {
    return this.repository.find({ where });
  }

  /**
   * Find by ID - throws if not found
   */
  async findById(id: number): Promise<Entity> {
    const entity = await this.repository.findOne({ where: { id } } as any);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  /**
   * Update entity - Override in subclasses for business logic
   */
  async update(id: number, updateDto: UpdateDto): Promise<Entity> {
    await this.findById(id); // Verify exists
    await this.repository.update(id, updateDto as any);
    return this.findById(id);
  }

  /**
   * Soft delete or hard delete - Override for soft delete if needed
   */
  async delete(id: number): Promise<void> {
    await this.findById(id); // Verify exists
    await this.repository.delete(id);
  }

  /**
   * Check if entity exists
   */
  async exists(id: number): Promise<boolean> {
    const count = await this.repository.count({ where: { id } } as any);
    return count > 0;
  }
}
