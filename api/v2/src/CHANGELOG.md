# Changelog

## [Unreleased]

### Adicionado
- Decoradores personalizados para documentação de API
  - `ApiDocs`: Facilita a documentação consistente de endpoints
  - `ApiPropertyWithExample`: Melhora a documentação de propriedades com exemplos
  - `ApiPropertyOptionalWithExample`: Versão para propriedades opcionais
- Guia de implementação para padronização da documentação
- Middlewares para melhorar a performance e segurança da API:
  - `CacheMiddleware`: Implementa cache para endpoints GET
  - `RequestLoggerMiddleware`: Registra detalhes das requisições
- Interceptors para melhorar a funcionalidade da API:
  - `LoggingInterceptor`: Registra tempo de resposta e informações de requisição
  - `TransformInterceptor`: Padroniza o formato de resposta da API
  - `TimeoutInterceptor`: Limita o tempo de execução das requisições
- Guards para controle de acesso:
  - `RateLimitGuard`: Limita número de requisições por cliente
  - `RolesGuard`: Controle de acesso baseado em perfis
- Pipes para validação e transformação de dados:
  - `ValidationPipe`: Validação aprimorada com mensagens em português
  - `SanitizePipe`: Limpeza de entradas para prevenir ataques

### Melhorado
- Configuração do Swagger com opções avançadas no `main.ts`
- Adicionadas medidas de segurança e performance:
  - Compressão de respostas usando `compression`
  - Cabeçalhos de segurança usando `helmet`
- Melhorias na documentação da API nos módulos:
  - Módulo de Usuário
  - Módulo de Projeto
  - Módulo de Autenticação
- Padronização das mensagens de validação em português
- DTOs com exemplos e validações mais rigorosas
- Melhor organização de código seguindo princípios SOLID

### Corrigido
- Implementação de códigos HTTP mais precisos nas respostas
- Validação mais rigorosa de entradas para prevenir erros
- Melhor tratamento de erros através de interceptors e pipes

## [1.0.0] - Data Inicial do Projeto

### Adicionado
- Estrutura inicial do projeto
- Implementação base de módulos e funcionalidades 