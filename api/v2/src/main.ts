import { Logger } from '@nestjs/common';
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
    origin: 'http://127.0.0.1:4200',
    credentials: true,
  });

  // Aplicar interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(60000), // 60 segundos de timeout
    new EntityNotFoundInterceptor(),
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
