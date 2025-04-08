/**
 * Script para atualizar automaticamente todos os serviços
 * aplicando princípios SOLID, tratamento de erros e logging.
 *
 * Como usar:
 * - Navegue até a pasta api/v2
 * - Execute: node scripts/controllers-update/update-services.js
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

// Padrões para identificar os arquivos de serviço
const SERVICE_PATTERN = /\.service\.ts$/;

// Imports a serem adicionados
const IMPORTS_TO_ADD = [
  "import { Logger } from '@nestjs/common';",
  "import { NotFoundException } from '@nestjs/common';",
];

/**
 * Encontra todos os arquivos de serviço nos módulos
 */
async function findAllServices() {
  const services = [];

  try {
    const modules = await readdir(MODULES_DIR);

    for (const moduleName of modules) {
      const modulePath = path.join(MODULES_DIR, moduleName);
      const moduleStat = await stat(modulePath);

      if (moduleStat.isDirectory()) {
        const files = await readdir(modulePath);

        const moduleServices = files
          .filter((file) => SERVICE_PATTERN.test(file))
          .map((file) => path.join(modulePath, file));

        services.push(...moduleServices);
      }
    }

    return services;
  } catch (error) {
    console.error('Erro ao procurar serviços:', error);
    return [];
  }
}

/**
 * Adiciona imports necessários ao arquivo
 */
function addImports(content) {
  let updatedContent = content;

  // Adiciona imports necessários se não existirem
  for (const importLine of IMPORTS_TO_ADD) {
    if (!updatedContent.includes(importLine)) {
      // Encontra o último import para adicionar depois dele
      const lastImportIndex = updatedContent.lastIndexOf('import');
      if (lastImportIndex !== -1) {
        const lastImportEnd = updatedContent.indexOf(';', lastImportIndex) + 1;
        updatedContent =
          updatedContent.substring(0, lastImportEnd) +
          '\n' +
          importLine +
          updatedContent.substring(lastImportEnd);
      } else {
        // Se não houver imports, adiciona no início do arquivo
        updatedContent = importLine + '\n' + updatedContent;
      }
    }
  }

  return updatedContent;
}

/**
 * Adiciona logger ao serviço
 */
function addLogger(content, className) {
  // Verifica se já tem logger
  if (content.includes('private readonly logger')) {
    return content;
  }

  // Encontra o início da classe
  const classPattern = new RegExp(`export class ${className}\\s*{`);
  const match = classPattern.exec(content);

  if (match) {
    const position = match.index + match[0].length;
    const beforeLogger = content.substring(0, position);
    const afterLogger = content.substring(position);

    // Adiciona o logger após a definição da classe
    return `${beforeLogger}\n  private readonly logger = new Logger(${className}.name);\n${afterLogger}`;
  }

  return content;
}

/**
 * Adiciona tratamento de erros aos métodos
 */
function addErrorHandling(content) {
  // Regex para encontrar métodos async no serviço
  const methodRegex = /async\s+(\w+)\s*\([^)]*\)\s*(?::[^{]+)?\s*{/g;

  let updatedContent = content;
  let match;

  while ((match = methodRegex.exec(content)) !== null) {
    const methodName = match[1];
    const methodStart = match.index;

    // Encontra o final do método
    let braceCount = 1;
    let methodEnd = methodStart + match[0].length;

    while (braceCount > 0 && methodEnd < content.length) {
      if (content[methodEnd] === '{') braceCount++;
      if (content[methodEnd] === '}') braceCount--;
      methodEnd++;
    }

    // Pega o conteúdo do método
    const methodContent = content.substring(methodStart, methodEnd);

    // Verifica se o método já tem try/catch
    if (!methodContent.includes('try {')) {
      // Adiciona try/catch ao método
      const methodBody = methodContent.substring(
        methodContent.indexOf('{') + 1,
        methodContent.lastIndexOf('}'),
      );

      const wrappedMethod = `async ${methodName}(${methodContent.match(/\([^)]*\)/)[0]}) ${methodContent.match(/(?::[^{]+)?\s*{/)[0]}
    try {${methodBody}
    } catch (error) {
      this.logger.error(\`Erro em ${methodName}: \${error.message}\`, error.stack);
      throw error;
    }
  }`;

      // Substitui o método original pelo método com try/catch
      updatedContent = updatedContent.replace(methodContent, wrappedMethod);
    }
  }

  return updatedContent;
}

/**
 * Adiciona verificações para valores não encontrados
 */
function addNotFoundChecks(content) {
  // Regex para encontrar métodos de busca por ID
  const findByIdRegex =
    /async\s+(findOne|findById|getById|get|find)\s*\([^)]*id[^)]*\)/g;

  let updatedContent = content;
  let match;

  while ((match = findByIdRegex.exec(content)) !== null) {
    const methodName = match[1];
    const methodStart = match.index;

    // Encontra o final do método
    let braceCount = 1;
    let methodEnd = content.indexOf('{', methodStart);
    methodEnd++;

    while (braceCount > 0 && methodEnd < content.length) {
      if (content[methodEnd] === '{') braceCount++;
      if (content[methodEnd] === '}') braceCount--;
      methodEnd++;
    }

    // Pega o conteúdo do método
    const methodContent = content.substring(methodStart, methodEnd);

    // Verifica se o método já tem verificação de 'não encontrado'
    if (
      !methodContent.includes('!') ||
      !methodContent.includes('throw') ||
      !methodContent.includes('NotFoundException')
    ) {
      // Identifica a variável que armazena o resultado da consulta
      const repositoryCallMatch = methodContent.match(
        /const\s+(\w+)\s+=\s+await\s+this\.\w+Repository\.findOne/,
      );

      if (repositoryCallMatch) {
        const entityVar = repositoryCallMatch[1];
        const entityType =
          methodContent.match(/:\s*Promise<([^>]+)>/)?.[1] || 'Entity';

        // Adiciona verificação após a chamada do repositório
        const findCallEnd =
          methodContent.indexOf(
            ';',
            methodContent.indexOf(`const ${entityVar}`),
          ) + 1;
        const beforeCheck = methodContent.substring(0, findCallEnd);
        const afterCheck = methodContent.substring(findCallEnd);

        // Determina a mensagem de erro com base no nome do método
        let errorMessage = `${entityType} não encontrado`;
        if (methodContent.includes('id:') || methodContent.includes('id :')) {
          errorMessage = `${entityType} com ID \${id} não encontrado`;
        }

        const updatedMethodContent = `${beforeCheck}
    
    if (!${entityVar}) {
      throw new NotFoundException(\`${errorMessage}\`);
    }
    ${afterCheck}`;

        // Substitui o método original
        updatedContent = updatedContent.replace(
          methodContent,
          updatedMethodContent,
        );
      }
    }
  }

  return updatedContent;
}

/**
 * Atualiza um arquivo de serviço
 */
async function updateService(filePath) {
  try {
    console.log(`Processando: ${filePath}`);

    // Lê o conteúdo atual do arquivo
    let content = await readFile(filePath, 'utf8');

    // Extrai o nome da classe do serviço
    const classNameMatch = content.match(/export\s+class\s+(\w+Service)/);
    if (!classNameMatch) {
      console.warn(
        `❗ Não foi possível encontrar a classe de serviço em ${filePath}`,
      );
      return;
    }

    const className = classNameMatch[1];

    // Adiciona imports necessários
    content = addImports(content);

    // Adiciona logger
    content = addLogger(content, className);

    // Adiciona tratamento de erros
    content = addErrorHandling(content);

    // Adiciona verificações para valores não encontrados
    content = addNotFoundChecks(content);

    // Escreve o arquivo atualizado
    await writeFile(filePath, content, 'utf8');

    console.log(`✅ Serviço atualizado: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Erro ao atualizar ${filePath}:`, error);
  }
}

/**
 * Função principal
 */
async function main() {
  try {
    const services = await findAllServices();
    console.log(`Encontrados ${services.length} serviços para atualizar.`);

    for (const service of services) {
      await updateService(service);
    }

    console.log('Processo de atualização concluído!');
  } catch (error) {
    console.error('Erro durante o processo de atualização:', error);
  }
}

// Executa a função principal
main();
