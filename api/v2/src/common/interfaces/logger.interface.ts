/**
 * Logger Interface - Dependency Inversion Principle
 * Allows easy swapping of logging implementations
 */
export interface ILogger {
  log(message: string, context?: string): void;
  error(message: string, error?: Error, context?: string): void;
  warn(message: string, context?: string): void;
  debug(message: string, context?: string): void;
}
