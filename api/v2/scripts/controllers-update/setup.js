/**
 * Script para configurar corretamente o projeto com os novos componentes
 *
 * Como usar:
 * - Navegue até a pasta api/v2
 * - Execute: node scripts/controllers-update/setup.js
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Caminho para os arquivos principais
const MAIN_TS_PATH = path.join(__dirname, '../../src/main.ts');
const APP_MODULE_PATH = path.join(__dirname, '../../src/app.module.ts');

/**
 * Atualiza o arquivo main.ts
 */
async function updateMainTs() {
  try {
    console.log('Atualizando main.ts...');
    const content = await readFile(MAIN_TS_PATH, 'utf8');

    // Verifica se os interceptors e pipes já estão configurados
    if (
      content.includes('ValidationPipe') &&
      content.includes('LoggingInterceptor') &&
      content.includes('TransformInterceptor') &&
      content.includes('TimeoutInterceptor')
    ) {
      console.log('✅ main.ts já está configurado.');
      return;
    }

    // Adiciona imports necessários
    let updatedContent = content;

    if (!content.includes('ValidationPipe from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { ValidationPipe } from './pipes/validation.pipe';" +
        updatedContent.substring(importEnd);
    }

    if (!content.includes('LoggingInterceptor from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { LoggingInterceptor } from './interceptors/logging.interceptor';" +
        updatedContent.substring(importEnd);
    }

    if (!content.includes('TransformInterceptor from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { TransformInterceptor } from './interceptors/transform.interceptor';" +
        updatedContent.substring(importEnd);
    }

    if (!content.includes('TimeoutInterceptor from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { TimeoutInterceptor } from './interceptors/timeout.interceptor';" +
        updatedContent.substring(importEnd);
    }

    // Adiciona a configuração dos pipes e interceptors
    if (!content.includes('app.useGlobalPipes')) {
      const listenIndex = updatedContent.indexOf('await app.listen');
      updatedContent =
        updatedContent.substring(0, listenIndex) +
        `
  // Configuração de pipes globais
  app.useGlobalPipes(new ValidationPipe());
  
  // Configuração de interceptors globais
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );

` +
        updatedContent.substring(listenIndex);
    }

    await writeFile(MAIN_TS_PATH, updatedContent, 'utf8');
    console.log('✅ main.ts atualizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao atualizar main.ts:', error);
  }
}

/**
 * Atualiza o arquivo app.module.ts
 */
async function updateAppModule() {
  try {
    console.log('Atualizando app.module.ts...');
    const content = await readFile(APP_MODULE_PATH, 'utf8');

    // Verifica se os guards e middleware já estão configurados
    if (
      content.includes('APP_GUARD') &&
      content.includes('RolesGuard') &&
      content.includes('RateLimitGuard') &&
      content.includes('implements NestModule')
    ) {
      console.log('✅ app.module.ts já está configurado.');
      return;
    }

    // Adiciona imports necessários
    let updatedContent = content;

    // Atualiza o import do @nestjs/common para incluir MiddlewareConsumer e NestModule
    const commonImportRegex =
      /import\s+{([^}]+)}\s+from\s+['"]@nestjs\/common['"]/;
    if (content.match(commonImportRegex)) {
      const commonImportMatch = content.match(commonImportRegex);
      if (
        !commonImportMatch[1].includes('MiddlewareConsumer') ||
        !commonImportMatch[1].includes('NestModule')
      ) {
        const updatedImport = commonImportMatch[0].replace(
          /import\s+{([^}]+)}\s+from\s+['"]@nestjs\/common['"]/,
          "import { $1, MiddlewareConsumer, NestModule } from '@nestjs/common'",
        );
        updatedContent = updatedContent.replace(
          commonImportRegex,
          updatedImport,
        );
      }
    }

    // Atualiza ou adiciona o import do @nestjs/core
    const coreImportRegex = /import\s+{([^}]+)}\s+from\s+['"]@nestjs\/core['"]/;
    if (content.match(coreImportRegex)) {
      const coreImportMatch = content.match(coreImportRegex);
      if (!coreImportMatch[1].includes('APP_GUARD')) {
        const updatedImport = coreImportMatch[0].replace(
          /import\s+{([^}]+)}\s+from\s+['"]@nestjs\/core['"]/,
          "import { $1, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'",
        );
        updatedContent = updatedContent.replace(coreImportRegex, updatedImport);
      }
    } else {
      const nestJsCommonImport = updatedContent.indexOf("from '@nestjs/common");
      const importEnd = updatedContent.indexOf(';', nestJsCommonImport) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';" +
        updatedContent.substring(importEnd);
    }

    // Adiciona imports para os guards
    if (!content.includes('RolesGuard from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { RolesGuard } from './guards/roles.guard';" +
        updatedContent.substring(importEnd);
    }

    if (!content.includes('RateLimitGuard from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { RateLimitGuard } from './guards/rate-limit.guard';" +
        updatedContent.substring(importEnd);
    }

    // Adiciona imports para os middlewares
    if (!content.includes('RequestLoggerMiddleware from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { RequestLoggerMiddleware } from './middlewares/request-logger.middleware';" +
        updatedContent.substring(importEnd);
    }

    if (!content.includes('CacheMiddleware from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { CacheMiddleware } from './middlewares/cache.middleware';" +
        updatedContent.substring(importEnd);
    }

    // Adiciona imports para os interceptors
    if (!content.includes('LoggingInterceptor from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { LoggingInterceptor } from './interceptors/logging.interceptor';" +
        updatedContent.substring(importEnd);
    }

    if (!content.includes('TransformInterceptor from')) {
      const importIndex = updatedContent.lastIndexOf('import');
      const importEnd = updatedContent.indexOf(';', importIndex) + 1;
      updatedContent =
        updatedContent.substring(0, importEnd) +
        "\nimport { TransformInterceptor } from './interceptors/transform.interceptor';" +
        updatedContent.substring(importEnd);
    }

    // Modifica a classe para implementar NestModule
    if (!content.includes('implements NestModule')) {
      updatedContent = updatedContent.replace(
        /export class AppModule {/,
        'export class AppModule implements NestModule {',
      );
    }

    // Adiciona os providers para os guards e interceptors
    if (!content.includes('APP_GUARD') || !content.includes('RolesGuard')) {
      const providersIndex = updatedContent.indexOf('providers: [');
      const providersEndMatch = updatedContent
        .substring(providersIndex)
        .match(/providers: \[([\s\S]*?)\]/);

      if (providersEndMatch) {
        const providersEnd = providersIndex + providersEndMatch[0].length;
        const providers = providersEndMatch[1];

        // Se não existem providers, adiciona os novos
        if (providers.trim() === '') {
          const updatedProviders = `providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ]`;

          updatedContent = updatedContent.replace(
            /providers: \[\s*\]/,
            updatedProviders,
          );
        } else {
          // Se já existem providers, adiciona os novos
          const updatedProviders = `providers: [${providers},
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ]`;

          updatedContent =
            updatedContent.substring(0, providersIndex) +
            updatedProviders +
            updatedContent.substring(providersEnd);
        }
      }
    }

    // Adiciona o método configure para os middlewares
    if (!content.includes('configure(consumer: MiddlewareConsumer)')) {
      const classEndIndex = updatedContent.lastIndexOf('}');

      const configureMethod = `
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestLoggerMiddleware, CacheMiddleware)
      .forRoutes('*');
  }
`;

      updatedContent =
        updatedContent.substring(0, classEndIndex) +
        configureMethod +
        updatedContent.substring(classEndIndex);
    }

    await writeFile(APP_MODULE_PATH, updatedContent, 'utf8');
    console.log('✅ app.module.ts atualizado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao atualizar app.module.ts:', error);
  }
}

/**
 * Função principal
 */
async function main() {
  try {
    console.log('Iniciando a configuração do projeto...');

    // Atualiza o arquivo main.ts
    await updateMainTs();

    // Atualiza o arquivo app.module.ts
    await updateAppModule();

    console.log('✅ Projeto configurado com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante a configuração do projeto:', error);
  }
}

// Executa a função principal
main();
