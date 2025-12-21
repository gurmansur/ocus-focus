import { Global, Module } from '@nestjs/common';
import { NestLoggerAdapter } from './logger/nest-logger.adapter';

/**
 * CommonModule - Shared utilities across the application
 * Follows Dependency Injection best practices
 * Provides singleton instances of shared services
 */
@Global()
@Module({
  providers: [
    {
      provide: 'ILogger',
      useClass: NestLoggerAdapter,
    },
    NestLoggerAdapter,
  ],
  exports: ['ILogger', NestLoggerAdapter],
})
export class CommonModule {}
