/**
 * Generic Repository Interface - Dependency Inversion Principle
 * Ensures all repositories follow a consistent contract
 */
export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  update(id: number, data: Partial<T>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}
