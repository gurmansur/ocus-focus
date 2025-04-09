import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';

/**
 * Função principal para inicialização da aplicação
 */
async function bootstrap() {
  // Create Winston logger instance
  const logger = WinstonModule.createLogger({
    transports: [
      // Console transport with formatted output
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.ms(),
          nestWinstonModuleUtilities.format.nestLike('OcusFocus', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      // File transport for all logs
      new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
      // Separate file for error logs only
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        level: 'error',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
      }),
    ],
  });

  // Create app with Winston logger
  const app = await NestFactory.create(AppModule, {
    logger,
  });

  // Configuração de CORS
  app.enableCors({
    origin: 'http://127.0.0.1:4200',
    credentials: true,
  });

  // Middleware para segurança com cabeçalhos HTTP
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'", 'https:'],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      // Habilitar HSTS (HTTP Strict Transport Security)
      hsts: {
        maxAge: 63072000, // 2 anos
        includeSubDomains: true,
        preload: true,
      },
      // Desabilitar X-Powered-By para esconder informações sobre o servidor
      hidePoweredBy: true,
    }),
  );

  // Middleware para compressão de respostas
  app.use(
    compression({
      // Nível de compressão (0-9): maior número = melhor compressão, mas mais CPU
      level: 6,
      // Limite de bytes - não comprimir respostas menores que 1KB
      threshold: 1024,
      // Comprimir todos os tipos MIME exceto imagens que já são comprimidas
      filter: (req, res) => {
        const contentType = (res.getHeader('Content-Type') as string) || '';
        return !contentType.includes('image/');
      },
    }),
  );

  // Configuração de pipes globais
  app.useGlobalPipes(new ValidationPipe());

  // Configuração de interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
    new ExceptionInterceptor(),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Ocus Focus')
    .setDescription('Documentação da API do projeto Ocus Focus')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  // Permitir que o Swagger UI funcione com Helmet habilitado
  // Aplicando configurações de segurança específicas ao caminho /docs
  app.use('/docs', (req, res, next) => {
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:",
    );
    next();
  });

  SwaggerModule.setup('docs', app, document);

  // Inicialização do servidor
  await app.listen(3333);

  logger.log(
    'Servidor rodando em http://localhost:3333 | Documentação disponível em http://localhost:3333/docs',
    'Bootstrap',
  );
}

bootstrap();
