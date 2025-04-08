import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Configura o Swagger para a aplicação NestJS
 * @param app Instância da aplicação NestJS
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Ocus Focus API')
    .setDescription('Documentação da API do projeto Ocus Focus')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', 'Endpoints de autenticação')
    .addTag('Colaborador', 'Endpoints de gerenciamento de colaboradores')
    .addTag('Projeto', 'Endpoints de gerenciamento de projetos')
    .addTag('Requisitos', 'Endpoints de gerenciamento de requisitos')
    .addTag('Caso de Uso', 'Endpoints de gerenciamento de casos de uso')
    .addTag('Caso de Teste', 'Endpoints de gerenciamento de casos de teste')
    .addTag('Suite de Teste', 'Endpoints de gerenciamento de suites de teste')
    .addTag('Execução de Teste', 'Endpoints de gerenciamento de execuções de teste')
    .addTag('Ator', 'Endpoints de gerenciamento de atores')
    .addTag('Kanban', 'Endpoints de gerenciamento de quadros kanban')
    .addTag('Fatores Ambientais', 'Endpoints de gerenciamento de fatores ambientais')
    .addTag('Fatores Técnicos', 'Endpoints de gerenciamento de fatores técnicos')
    .addTag('Estimativa', 'Endpoints de gerenciamento de estimativas')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  // Personaliza o CSS do Swagger UI para melhorar a aparência
  const customOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .information-container { padding: 20px }
      .swagger-ui .scheme-container { padding: 20px }
      .swagger-ui .opblock-tag { font-size: 18px }
      .swagger-ui .opblock .opblock-summary-method { font-weight: bold }
    `,
    customSiteTitle: 'Ocus Focus API Documentation',
  };

  SwaggerModule.setup('docs', app, document, customOptions);
} 