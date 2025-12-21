/**
 * Validation Interface - Single Responsibility Principle
 * Encapsulates validation logic to prevent fat services
 */
export interface IValidator<T> {
  validate(data: T): Promise<{ valid: boolean; errors?: string[] }>;
}
