import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  private readonly logger = new Logger(TypeOrmConfigService.name);

  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const nodeEnv = process.env.NODE_ENV || 'dev';
    this.logger.log(`Using environment: ${nodeEnv}`);

    switch (nodeEnv) {
      case 'dev':
        return this.getDevConfig();
      case 'prod':
        return this.getProdConfig();
      case 'test':
        return this.getTestConfig();
      default:
        return this.getDevConfig();
    }
  }

  private getDevConfig(): TypeOrmModuleOptions {
    this.logger.log(
      `Using database: ${this.configService.get<string>('DB_DATABASE')} (from .env.dev)`,
    );

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    };
  }

  private getProdConfig(): TypeOrmModuleOptions {
    this.logger.log(
      `Using database: ${this.configService.get<string>('DB_DATABASE')} (from .env.prod)`,
    );

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: false,
    };
  }

  private getTestConfig(): TypeOrmModuleOptions {
    this.logger.log(
      `Using database: ${this.configService.get<string>('DB_DATABASE')} (from .env.test)`,
    );

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: true,
      migrationsRun: false,
    };
  }
}
