import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
  HttpExceptionFilter,
} from './filters/http-exception.filter';
import {
  EntityNotFoundInterceptor,
  LoggingInterceptor,
  TimeoutInterceptor,
  TransformInterceptor,
} from './interceptors';
import { setupSwagger } from './swagger-setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://127.0.0.1:4200',
    credentials: true,
  });

  // Aplicar interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(60000), // 60 segundos de timeout
    new EntityNotFoundInterceptor(),
  );

  // Configurar validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades que não existem no DTO
      forbidNonWhitelisted: true, // Retorna erro para propriedades não esperadas
      transform: true, // Transforma os dados de entrada para o tipo do DTO
      transformOptions: {
        enableImplicitConversion: true, // Permite converter strings em números automaticamente
      },
      enableDebugMessages: true, // Habilita mensagens de debug no console
      stopAtFirstError: false, // Coleta todos os erros antes de parar
      dismissDefaultMessages: false, // Mantém as mensagens padrão de erro
      exceptionFactory: (errors) => {
        const formattedErrors = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : ['Erro de validação'];

          return {
            campo: error.property,
            mensagens: constraints,
          };
        });

        return new Error(
          JSON.stringify({
            message: 'Erro de validação',
            errors: formattedErrors,
          }),
        );
      },
    }),
  );

  // Aplicar filtros de exceção
  app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());

  // Configurar Swagger
  setupSwagger(app);

  await app.listen(3333);

  Logger.log(
    'Servidor rodando em http://localhost:3333 | Consulte a documentação em http://localhost:3333/docs',
    'Bootstrap',
  );
}
bootstrap();
