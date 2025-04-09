import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import authConfig from '../src/config/auth.config';
import cacheConfig from '../src/config/cache.config';
import loggerConfig from '../src/config/logger.config';
import throttlerConfig from '../src/config/throttler.config';
import { TypeOrmConfigService } from '../src/config/typeorm.config';

const logger = new Logger('E2E-Tests');

// Flag to control whether tests should attempt to access the database
export const USE_DATABASE = false;

export async function initializeApp(): Promise<INestApplication> {
  // Set NODE_ENV to test to ensure test database is used
  process.env.NODE_ENV = 'test';

  logger.log('Initializing test application...');

  if (USE_DATABASE) {
    logger.log(
      `Using database: ${process.env.DB_DATABASE || 'ocus_focus_test'}`,
    );
  } else {
    logger.log('Database access disabled - using mock mode');
  }

  try {
    const imports = [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
        load: [authConfig, cacheConfig, throttlerConfig, loggerConfig],
      }),
      JwtModule.registerAsync({
        global: true,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          secret: configService.get('auth.jwt.secret'),
          signOptions: {
            expiresIn: `${configService.get('auth.jwt.expiresIn')}s`,
          },
        }),
      }),
    ];

    // Only add TypeORM if we're using the database
    if (USE_DATABASE) {
      imports.push(
        TypeOrmModule.forRootAsync({
          useClass: TypeOrmConfigService,
        }),
      );
    }

    // Add the AppModule last
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [...imports, AppModule],
    }).compile();

    const app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
    logger.log('Test application initialized successfully');
    return app;
  } catch (error) {
    logger.error(`Failed to initialize test application: ${error.message}`);
    logger.error(
      'Make sure the database is running and credentials are correct',
    );
    // Re-throw the error for Jest to catch and report
    throw error;
  }
}

export async function cleanupDatabase(app: INestApplication) {
  try {
    logger.log('Cleaning up test resources...');
    if (app) {
      await app.close();
    }
    logger.log('Test application closed');
  } catch (error) {
    logger.error(`Error during cleanup: ${error.message}`);
    // Don't throw the error to prevent test failures during cleanup
  }
}

// Mock JWT token for tests
export const MOCK_JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlc3QgVXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

// Helper function to get an auth token for authenticated endpoints
export async function getAuthToken(
  app: INestApplication,
  email: string = 'test@example.com',
  password: string = 'Password123!',
): Promise<string> {
  if (!USE_DATABASE) {
    return MOCK_JWT_TOKEN;
  }

  try {
    logger.log(`Getting auth token for ${email}...`);

    // Check if user exists, if not create one
    const users = await request(app.getHttpServer())
      .get('/colaboradores')
      .set('Authorization', 'Bearer any-token') // This might fail, which is expected
      .catch(() => ({ body: [] }));

    if (!users.body.find((user) => user.email === email)) {
      logger.log(`Creating test user ${email}...`);
      await request(app.getHttpServer()).post('/signup').send({
        nome: 'Test User',
        email,
        senha: password,
        empresa: 'Test Company',
        cargo: 'Test Role',
      });
    }

    const response = await request(app.getHttpServer())
      .post('/signin-colaborador')
      .send({
        email,
        senha: password,
      });

    if (!response.body.accessToken) {
      throw new Error('Failed to get auth token');
    }

    logger.log('Auth token obtained successfully');
    return response.body.accessToken;
  } catch (error) {
    logger.error(`Error getting auth token: ${error.message}`);
    return MOCK_JWT_TOKEN; // Fall back to mock token if there's an error
  }
}
