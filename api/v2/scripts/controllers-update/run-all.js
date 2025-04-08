/**
 * Script para executar todas as etapas de atualização em sequência
 * 
 * Como usar:
 * - Navegue até a pasta api/v2
 * - Execute: node scripts/controllers-update/run-all.js
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Iniciando o processo de atualização do projeto...');
console.log('==========================================================');

try {
  // Configura o projeto com os novos componentes
  console.log('\n📦 Etapa 1: Configurando o projeto com os novos componentes...');
  execSync('node scripts/controllers-update/setup.js', { stdio: 'inherit' });
  console.log('✅ Configuração do projeto concluída!\n');
  
  // Atualiza os controllers
  console.log('\n🛠️ Etapa 2: Atualizando os controllers...');
  execSync('node scripts/controllers-update/update-controllers.js', { stdio: 'inherit' });
  console.log('✅ Atualização dos controllers concluída!\n');
  
  // Atualiza os serviços
  console.log('\n⚙️ Etapa 3: Atualizando os serviços...');
  execSync('node scripts/controllers-update/update-services.js', { stdio: 'inherit' });
  console.log('✅ Atualização dos serviços concluída!\n');
  
  console.log('==========================================================');
  console.log('✅ Processo de atualização do projeto concluído com sucesso!');
  console.log('\nPróximos passos:');
  console.log('1. Execute os testes do projeto para verificar se tudo está funcionando');
  console.log('2. Verifique se há erros de lint e corrija-os se necessário');
  console.log('3. Inicie o servidor e teste manualmente se necessário');
  console.log('\nMelhorias aplicadas:');
  console.log('- Adicionados middlewares para logging e cache');
  console.log('- Adicionados interceptors para logging, timeout e formatação de resposta');
  console.log('- Adicionados pipes para validação e sanitização');
  console.log('- Adicionados guards para controle de acesso baseado em perfil e limitação de taxa');
  console.log('- Melhorada a documentação da API com decorators ApiDocs');
  console.log('- Aplicado tratamento de erros em todos os serviços');
  console.log('- Adicionado logging em todo o projeto');
  console.log('- Aplicados princípios SOLID para melhor manutenibilidade');
  
} catch (error) {
  console.error('\n❌ Erro durante o processo de atualização:');
  console.error(error.message);
  console.error('\nPor favor, verifique os erros acima e tente novamente.');
  process.exit(1);
} 