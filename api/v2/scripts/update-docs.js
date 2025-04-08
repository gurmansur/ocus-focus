/**
 * Script para identificar controllers e DTOs que precisam ser atualizados
 * com os novos decoradores de documentação da API.
 *
 * Uso: node scripts/update-docs.js
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Diretório dos módulos
const modulesDir = path.join(__dirname, '..', 'src', 'modules');

// Padrões a serem verificados
const patterns = {
  controllers: {
    // Procura por controllers sem ApiDocs
    search: '@ApiResponse',
    replace: '@ApiDocs',
  },
  dtos: {
    // Procura por DTOs sem ApiPropertyWithExample
    search: '@ApiProperty',
    replace: '@ApiPropertyWithExample',
  },
};

// Funções auxiliares
const findFiles = (dir, pattern) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Recursivamente procura em subdiretórios
      results = results.concat(findFiles(filePath, pattern));
    } else {
      // Verifica se o arquivo corresponde ao padrão
      if (pattern.test(file)) {
        results.push(filePath);
      }
    }
  });

  return results;
};

const checkFileContent = (file, searchPattern) => {
  const content = fs.readFileSync(file, 'utf8');
  return content.includes(searchPattern);
};

// Encontrar todos os controllers
console.log('Analisando controllers e DTOs que precisam de atualização...\n');

const controllersPattern = /\.controller\.ts$/;
const dtosPattern = /\.dto\.ts$/;

// Encontrar controllers
const controllers = findFiles(modulesDir, controllersPattern);
const controllersToUpdate = controllers.filter((file) =>
  checkFileContent(file, patterns.controllers.search),
);

// Encontrar DTOs
const dtos = findFiles(modulesDir, dtosPattern);
const dtosToUpdate = dtos.filter((file) =>
  checkFileContent(file, patterns.dtos.search),
);

// Exibir resultados
console.log('=== CONTROLLERS QUE PRECISAM SER ATUALIZADOS ===');
if (controllersToUpdate.length) {
  controllersToUpdate.forEach((file) => {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    console.log(`- ${relativePath}`);
  });
} else {
  console.log('Nenhum controller precisa ser atualizado.');
}

console.log('\n=== DTOs QUE PRECISAM SER ATUALIZADOS ===');
if (dtosToUpdate.length) {
  dtosToUpdate.forEach((file) => {
    const relativePath = path.relative(path.join(__dirname, '..'), file);
    console.log(`- ${relativePath}`);
  });
} else {
  console.log('Nenhum DTO precisa ser atualizado.');
}

// Estatísticas
console.log('\n=== ESTATÍSTICAS ===');
console.log(`Controllers analisados: ${controllers.length}`);
console.log(`Controllers para atualizar: ${controllersToUpdate.length}`);
console.log(`DTOs analisados: ${dtos.length}`);
console.log(`DTOs para atualizar: ${dtosToUpdate.length}`);

// Instruções
console.log('\n=== PRÓXIMOS PASSOS ===');
console.log(
  '1. Atualize os DTOs para usar ApiPropertyWithExample e ApiPropertyOptionalWithExample',
);
console.log('2. Atualize os controllers para usar o decorator ApiDocs');
console.log(
  '3. Siga o guia em src/README-aprimoramento-api.md para manter a consistência',
);
console.log(
  '4. Execute testes para garantir que as mudanças não quebraram a aplicação',
);
