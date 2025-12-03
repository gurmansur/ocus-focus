# Guia para Documentação Swagger

Este documento contém diretrizes para adicionar documentação Swagger detalhada aos controllers e DTOs da aplicação.

## Decoradores Principais

### Para Controllers

- `@ApiTags('Nome do Módulo')` - Categoriza endpoints no Swagger UI
- `@ApiBearerAuth()` - Indica que o endpoint requer autenticação Bearer
- `@ApiOperation({ summary: '', description: '' })` - Descreve a operação
- `@ApiResponse` decorators:
  - `@ApiOkResponse()` - Status 200
  - `@ApiCreatedResponse()` - Status 201
  - `@ApiBadRequestResponse()` - Status 400
  - `@ApiUnauthorizedResponse()` - Status 401
  - `@ApiForbiddenResponse()` - Status 403
  - `@ApiNotFoundResponse()` - Status 404
- `@ApiParam()` - Documenta parâmetros de rota
- `@ApiQuery()` - Documenta parâmetros de query
- `@ApiBody()` - Documenta o corpo da requisição

### Para DTOs

- `@ApiProperty()` - Documenta propriedades da classe
- `@ApiPropertyOptional()` - Documenta propriedades opcionais

## Exemplos de Implementação

### Exemplo de Controller

```typescript
@ApiTags('Recurso')
@ApiBearerAuth()
@Controller('recursos')
export class RecursoController {
  @Post()
  @ApiOperation({
    summary: 'Criar recurso',
    description: 'Descrição detalhada da operação',
  })
  @ApiCreatedResponse({
    description: 'Recurso criado com sucesso',
    type: RecursoDto,
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos fornecidos',
  })
  create(@Body() createRecursoDto: CreateRecursoDto) {
    // implementação
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar recurso por ID',
    description: 'Recupera um recurso específico pelo seu ID',
  })
  @ApiOkResponse({
    description: 'Recurso encontrado',
    type: RecursoDto,
  })
  @ApiNotFoundResponse({
    description: 'Recurso não encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único do recurso',
    type: Number,
    example: 1,
  })
  findOne(@Param('id') id: number) {
    // implementação
  }
}
```

### Exemplo de DTO

```typescript
export class CreateRecursoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Nome do recurso',
    example: 'Exemplo de nome',
    required: true,
  })
  nome: string;

  @IsEnum(['TIPO_A', 'TIPO_B', 'TIPO_C'])
  @IsNotEmpty()
  @ApiProperty({
    description: 'Tipo do recurso',
    enum: ['TIPO_A', 'TIPO_B', 'TIPO_C'],
    example: 'TIPO_A',
    required: true,
  })
  tipo: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Descrição opcional do recurso',
    example: 'Exemplo de descrição',
  })
  descricao?: string;
}
```

## Boas Práticas

1. **Descrições Claras**: Forneça descrições claras e objetivas que expliquem o propósito de cada endpoint e propriedade.

2. **Exemplos Realistas**: Inclua exemplos realistas que ajudem a entender a estrutura dos dados esperados.

3. **Tipos Adequados**: Especifique os tipos corretos para cada propriedade (string, number, boolean, etc.).

4. **Documentação de Erros**: Documente todos os possíveis códigos de erro que seu endpoint pode retornar.

5. **Enumerações**: Para campos com valores predefinidos, use o atributo `enum` para listar todas as possibilidades.

6. **Consistência**: Mantenha um padrão consistente de documentação em toda a aplicação.

7. **Agrupamento**: Use `@ApiTags` para agrupar endpoints relacionados.

8. **Autenticação**: Use `@ApiBearerAuth()` para indicar endpoints que exigem autenticação.

## Quando Atualizar a Documentação

A documentação do Swagger deve ser atualizada nos seguintes casos:

1. Ao criar novos endpoints
2. Ao modificar parâmetros existentes
3. Ao alterar contratos de dados (DTOs)
4. Ao modificar respostas de endpoints
5. Ao adicionar novas validações

A documentação adequada é essencial para facilitar o uso da API por outros desenvolvedores e garantir a manutenibilidade do código a longo prazo.
