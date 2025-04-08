# Scripts de Atualização do Projeto

Este diretório contém scripts para melhorar a qualidade, segurança e manutenibilidade do projeto, aplicando padrões de projeto, princípios SOLID e melhores práticas.

## Como Usar

Para aplicar todas as melhorias em uma única etapa, execute:

```bash
cd api/v2
node scripts/controllers-update/run-all.js
```

Alternativamente, você pode executar cada script individualmente:

1. **Configuração inicial**:
   ```bash
   node scripts/controllers-update/setup.js
   ```

2. **Atualização dos controllers**:
   ```bash
   node scripts/controllers-update/update-controllers.js
   ```

3. **Atualização dos serviços**:
   ```bash
   node scripts/controllers-update/update-services.js
   ```

## Melhorias Implementadas

### Middlewares

- **RequestLoggerMiddleware**: Registra detalhes de todas as requisições HTTP.
- **CacheMiddleware**: Implementa cache em memória para melhorar a performance das requisições GET.

### Interceptors

- **LoggingInterceptor**: Registra informações sobre requisições e tempo de resposta.
- **TransformInterceptor**: Padroniza o formato de resposta da API (success, data, timestamp).
- **TimeoutInterceptor**: Limita o tempo máximo de execução das requisições para 30 segundos.

### Pipes

- **ValidationPipe**: Versão personalizada do ValidationPipe do NestJS com mensagens de erro formatadas.
- **SanitizePipe**: Remove conteúdo HTML e escapa caracteres especiais para evitar ataques XSS.

### Guards

- **RolesGuard**: Implementa controle de acesso baseado em perfis.
- **RateLimitGuard**: Limita o número de requisições por cliente para evitar abusos.

### Decorators

- **Roles**: Define permissões necessárias para acessar endpoints.
- **ApiDocs**: Simplifica a documentação Swagger.

## Mudanças nos Controllers

Os controllers foram atualizados para incluir:

- Validação apropriada de parâmetros com pipes
- Documentação API melhorada
- Controle de acesso baseado em perfis
- Valores padrão para parâmetros de paginação

## Mudanças nos Serviços

Os serviços foram atualizados para:

- Adicionar tratamento de erros consistente
- Adicionar logging em todas as operações
- Verificar valores não encontrados e lançar exceções apropriadas
- Aplicar princípios SOLID para melhor manutenibilidade

## Princípios SOLID Aplicados

- **Single Responsibility**: Cada classe tem uma única responsabilidade.
- **Open-Closed**: As classes são abertas para extensão, mas fechadas para modificação.
- **Liskov Substitution**: Os tipos derivados são substituíveis por seus tipos base.
- **Interface Segregation**: Interfaces específicas são preferíveis a interfaces genéricas.
- **Dependency Inversion**: Dependência de abstrações, não de implementações concretas.

## Observações

- Os scripts fazem backup automático dos arquivos originais antes de modificá-los.
- As mudanças não afetam a compatibilidade com clientes existentes.
- Todos os comentários foram mantidos em português conforme solicitado. 