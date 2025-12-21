import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * AppConfigService - Centralized Configuration Management
 * Single Responsibility: Only responsible for config access
 * Dependency Inversion: Other services depend on this abstraction, not ConfigService directly
 */
@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  /**
   * Database Configuration
   */
  get dbHost(): string {
    return this.configService.get<string>('DB_HOST');
  }

  get dbPort(): number {
    return this.configService.get<number>('DB_PORT');
  }

  get dbUsername(): string {
    return this.configService.get<string>('DB_USERNAME');
  }

  get dbPassword(): string {
    return this.configService.get<string>('DB_PASSWORD');
  }

  get dbDatabase(): string {
    return this.configService.get<string>('DB_DATABASE');
  }

  /**
   * JWT Configuration
   */
  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '24h');
  }

  /**
   * Application Configuration
   */
  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'dev');
  }

  get appPort(): number {
    return this.configService.get<number>('APP_PORT', 3333);
  }

  get corsOrigin(): string {
    return this.configService.get<string>(
      'CORS_ORIGIN',
      'http://127.0.0.1:4200',
    );
  }

  /**
   * Check if running in production
   */
  get isProduction(): boolean {
    return this.nodeEnv === 'prod';
  }

  /**
   * Check if running in development
   */
  get isDevelopment(): boolean {
    return this.nodeEnv === 'dev';
  }

  /**
   * Check if running in test
   */
  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }
}
