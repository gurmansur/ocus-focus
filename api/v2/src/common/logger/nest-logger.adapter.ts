import { Injectable, Logger } from '@nestjs/common';
import { ILogger } from '../interfaces/logger.interface';

/**
 * NestLoggerAdapter - Adapter Pattern + Dependency Inversion
 * Wraps NestJS Logger to implement custom ILogger interface
 * Allows easy substitution with other logging providers
 */
@Injectable()
export class NestLoggerAdapter implements ILogger {
  private logger = new Logger();

  log(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  error(message: string, error?: Error, context?: string): void {
    this.logger.error(error?.message || message, error?.stack, context);
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, context);
  }
}
