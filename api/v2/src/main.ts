import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://127.0.0.1:4200',
    credentials: true,
  });

  // Configuração de pipes globais
  app.useGlobalPipes(new ValidationPipe());

  // Configuração de interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );

  const config = new DocumentBuilder()
    .setTitle('Ocus Focus')
    .setDescription('Documentação da API do projeto Ocus Focus')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  SwaggerModule.setup('docs', app, document);

  await app.listen(3333);

  Logger.log(
    'Server running on http://localhost:3333 | Check the documentation on http://localhost:3333/docs',
    'Bootstrap',
  );
}
bootstrap();
