# Documentação de APIs com Exemplos

Este pacote contém decoradores para facilitar a documentação das APIs no Swagger com exemplos de requisição e resposta.

## ApiDocs

O decorador `ApiDocs` estende a funcionalidade padrão do Swagger do NestJS para incluir exemplos de entrada e saída.

### Uso Básico

```typescript
@Post('users')
@ApiDocs({
  summary: 'Criar um novo usuário',
  description: 'Cria um novo usuário com os dados fornecidos',
  responseDescription: 'Usuário criado com sucesso',
  status: HttpStatus.CREATED,
  requiresAuth: true,
  requestExampleDto: CreateUserDto,
  responseExampleDto: UserResponseDto,
})
createUser(@Body() createUserDto: CreateUserDto): any {
  // implementação
}
```

### Opções

- `summary`: Resumo da operação (obrigatório)
- `description`: Descrição detalhada da operação
- `responseDescription`: Descrição da resposta
- `status`: Código HTTP da resposta de sucesso (padrão: 200)
- `requiresAuth`: Indica se a rota requer autenticação (padrão: true)
- `requestExampleDto`: DTO de exemplo para a requisição (body)
- `responseExampleDto`: DTO de exemplo para a resposta

## ApiPropertyWithExample

Decorador para adicionar exemplo a uma propriedade em um DTO:

```typescript
@ApiPropertyWithExample('john.doe@example.com', {
  description: 'Email do usuário',
})
@IsEmail()
email: string;
```

## ApiPropertyOptionalWithExample

Decorador para adicionar exemplo a uma propriedade opcional em um DTO:

```typescript
@ApiPropertyOptionalWithExample(true, {
  description: 'Indica se o usuário está ativo',
})
@IsBoolean()
@IsOptional()
active?: boolean;
```

## Exemplo Completo

```typescript
// DTO de entrada
export class CreateUserDto {
  @ApiPropertyWithExample('john.doe@example.com', {
    description: 'Email do usuário',
  })
  @IsEmail()
  email: string;

  @ApiPropertyWithExample('João Silva', {
    description: 'Nome completo do usuário',
  })
  @IsString()
  name: string;
}

// DTO de saída
export class UserResponseDto {
  @ApiPropertyWithExample(1, {
    description: 'ID único do usuário',
  })
  id: number;

  @ApiPropertyWithExample('john.doe@example.com')
  email: string;
}

// Controller
@Controller('users')
export class UserController {
  @Post()
  @ApiDocs({
    summary: 'Criar usuário',
    requestExampleDto: CreateUserDto,
    responseExampleDto: UserResponseDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    // implementação
  }
}
```

## Formatação da Resposta

Ao usar o `responseExampleDto`, a documentação vai mostrar a resposta formatada com o padrão de resposta da API:

```json
{
  "data": {
    // Conteúdo do responseExampleDto
  },
  "success": true,
  "timestamp": "2023-04-20T14:30:00Z"
}
```

Isso está alinhado com o formato padronizado pelo `TransformInterceptor`. 