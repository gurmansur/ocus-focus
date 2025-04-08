/**
 * Script para atualizar automaticamente todos os controllers
 * aplicando melhores práticas, princípios SOLID, e recursos de segurança.
 *
 * Como usar:
 * - Navegue até a pasta api/v2
 * - Execute: node scripts/controllers-update/update-controllers.js
 */

const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Diretório base dos módulos
const MODULES_DIR = path.join(__dirname, '../../src/modules');

// Padrões para identificar os arquivos de controller
const CONTROLLER_PATTERN = /\.controller\.ts$/;

// Mapeamento de imports comuns a serem adicionados
const COMMON_IMPORTS = {
  HttpStatus: '@nestjs/common',
  ParseIntPipe: '@nestjs/common',
  DefaultValuePipe: '@nestjs/common',
  SanitizePipe: '../../pipes/sanitize.pipe',
  ApiDocs: '../../decorators/api-docs.decorator',
  Roles: '../../decorators/roles.decorator',
};

/**
 * Encontra todos os arquivos de controller nos módulos
 */
async function findAllControllers() {
  const controllers = [];

  try {
    const modules = await readdir(MODULES_DIR);

    for (const moduleName of modules) {
      const modulePath = path.join(MODULES_DIR, moduleName);
      const moduleStat = await stat(modulePath);

      if (moduleStat.isDirectory()) {
        const files = await readdir(modulePath);

        const moduleControllers = files
          .filter((file) => CONTROLLER_PATTERN.test(file))
          .map((file) => path.join(modulePath, file));

        controllers.push(...moduleControllers);
      }
    }

    return controllers;
  } catch (error) {
    console.error('Erro ao procurar controllers:', error);
    return [];
  }
}

/**
 * Adiciona os imports necessários ao arquivo
 */
function addMissingImports(content) {
  // Verifica quais imports já existem
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/g;
  const existingImports = {};

  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const items = match[1].split(',').map((item) => item.trim());
    const source = match[2];

    if (!existingImports[source]) {
      existingImports[source] = new Set();
    }

    items.forEach((item) => existingImports[source].add(item));
  }

  // Prepara os imports a serem adicionados
  const importsToAdd = {};

  for (const [importItem, source] of Object.entries(COMMON_IMPORTS)) {
    if (!existingImports[source] || !existingImports[source].has(importItem)) {
      if (!importsToAdd[source]) {
        importsToAdd[source] = [];
      }
      importsToAdd[source].push(importItem);
    }
  }

  // Constrói as linhas de import a serem adicionadas
  const importLines = [];

  for (const [source, items] of Object.entries(importsToAdd)) {
    if (items.length > 0) {
      importLines.push(`import { ${items.join(', ')} } from '${source}';`);
    }
  }

  // Insere os novos imports após o último import existente
  if (importLines.length > 0) {
    const lastImportIndex = content.lastIndexOf('import');
    const lastImportLineEnd = content.indexOf(';', lastImportIndex) + 1;

    const beforeImports = content.substring(0, lastImportLineEnd);
    const afterImports = content.substring(lastImportLineEnd);

    return `${beforeImports}\n${importLines.join('\n')}\n${afterImports}`;
  }

  return content;
}

/**
 * Adiciona os decorators ApiDocs aos métodos
 */
function addApiDocsDecorators(content) {
  // Regex para encontrar métodos HTTP
  const methodRegex = /@(Get|Post|Patch|Delete|Put)\(['"](.*)['"]\)\s+(\w+)\(/g;

  return content.replace(methodRegex, (match, httpMethod, path, methodName) => {
    // Pula se já tem ApiDocs
    if (match.includes('@ApiDocs')) {
      return match;
    }

    // Cria o decorador adequado
    let summary = '';
    let responseDescription = '';
    let status = 'HttpStatus.OK';

    if (httpMethod === 'Get') {
      summary = `Obtém ${path}`;
      responseDescription = 'Dados recuperados com sucesso';
    } else if (httpMethod === 'Post') {
      summary = `Cria ${path}`;
      responseDescription = 'Recurso criado com sucesso';
      status = 'HttpStatus.CREATED';
    } else if (httpMethod === 'Patch' || httpMethod === 'Put') {
      summary = `Atualiza ${path}`;
      responseDescription = 'Recurso atualizado com sucesso';
    } else if (httpMethod === 'Delete') {
      summary = `Remove ${path}`;
      responseDescription = 'Recurso removido com sucesso';
      status = 'HttpStatus.NO_CONTENT';
    }

    const apiDocsDecorator = `@ApiDocs({
    summary: '${summary}',
    responseDescription: '${responseDescription}',
    status: ${status},
  })
  @${httpMethod}('${path}') ${methodName}(`;

    return apiDocsDecorator;
  });
}

/**
 * Adiciona validação com SanitizePipe aos parâmetros Body
 */
function addSanitizePipe(content) {
  const bodyParamRegex = /@Body\(\)\s+(\w+):\s+/g;

  return content.replace(bodyParamRegex, '@Body(SanitizePipe) $1: ');
}

/**
 * Adiciona validação com ParseIntPipe aos parâmetros de query e path numéricos
 */
function addParseIntPipe(content) {
  // Adiciona ParseIntPipe para parâmetros de ID
  const paramRegex = /@(Param|Query)\(['"](\w+)['"]\)\s+(\w+):\s+(\w+)/g;

  return content.replace(
    paramRegex,
    (match, decoratorName, paramName, varName, typeName) => {
      // Se o parâmetro parece ser um ID ou algo numérico e o tipo não tem ParseIntPipe
      if (
        (paramName.includes('id') ||
          paramName.includes('Id') ||
          paramName === 'page' ||
          paramName === 'limit' ||
          paramName === 'size' ||
          paramName === 'pageSize') &&
        !match.includes('ParseIntPipe')
      ) {
        // Para parâmetros de paginação, adicione DefaultValuePipe
        if (
          paramName === 'page' ||
          paramName === 'pageSize' ||
          paramName === 'limit' ||
          paramName === 'size'
        ) {
          const defaultValue = paramName === 'page' ? 1 : 10;
          return `@${decoratorName}('${paramName}', new DefaultValuePipe(${defaultValue}), ParseIntPipe) ${varName}: number`;
        }

        return `@${decoratorName}('${paramName}', ParseIntPipe) ${varName}: number`;
      }

      return match;
    },
  );
}

/**
 * Atualiza um arquivo de controller
 */
async function updateController(filePath) {
  try {
    console.log(`Processando: ${filePath}`);

    // Lê o conteúdo atual do arquivo
    let content = await readFile(filePath, 'utf8');

    // Adiciona imports necessários
    content = addMissingImports(content);

    // Adiciona ApiDocs aos métodos
    content = addApiDocsDecorators(content);

    // Adiciona SanitizePipe aos parâmetros Body
    content = addSanitizePipe(content);

    // Adiciona ParseIntPipe aos parâmetros numéricos
    content = addParseIntPipe(content);

    // Escreve o arquivo atualizado
    await writeFile(filePath, content, 'utf8');

    console.log(`✅ Controller atualizado: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error);
  }
}

/**
 * Função principal
 */
async function main() {
  try {
    const controllers = await findAllControllers();
    console.log(
      `Encontrados ${controllers.length} controllers para atualizar.`,
    );

    for (const controller of controllers) {
      await updateController(controller);
    }

    console.log('Processo de atualização concluído!');
  } catch (error) {
    console.error('Erro durante o processo de atualização:', error);
  }
}

// Executa a função principal
main();
