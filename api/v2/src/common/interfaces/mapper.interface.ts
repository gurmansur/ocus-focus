/**
 * Data Mapper Interface - Single Responsibility Principle
 * Separates data transformation logic from business logic
 */
export interface IMapper<T, D> {
  toDomain(raw: any): T;
  toPersistence(domain: T): D;
}
