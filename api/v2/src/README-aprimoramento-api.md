# Guia de Aprimoramento de API

Este documento descreve as melhorias implementadas na documentação da API e como aplicá-las a novos componentes ou módulos.

## 1. Decoradores para Documentação

### ApiDocs

O decorador `ApiDocs` substitui os decoradores padrão `@ApiResponse` do Swagger, oferecendo uma maneira mais consistente de documentar endpoints.

```typescript
@Post()
@ApiDocs({
  summary: 'Criar um novo usuário',
  description: 'Cria um novo usuário com os dados fornecidos',
  responseDescription: 'Usuário criado com sucesso',
  status: HttpStatus.CREATED,
  requestExampleDto: CreateUsuarioDto,
  responseExampleDto: UsuarioDto,
})
create(@Body() createUsuarioDto: CreateUsuarioDto) {
  return this.usuarioService.create(createUsuarioDto);
}
```

### ApiPropertyWithExample e ApiPropertyOptionalWithExample

Substitua os decoradores `@ApiProperty` por estes para documentar propriedades com exemplos:

```typescript
// Para propriedades obrigatórias
@ApiPropertyWithExample('joao.silva@exemplo.com', {
  description: 'Email do usuário',
})
@IsEmail({}, { message: 'Email inválido' })
@IsNotEmpty({ message: 'O email é obrigatório' })
email: string;

// Para propriedades opcionais
@ApiPropertyOptionalWithExample(true, {
  description: 'Indica se o usuário está ativo',
})
@IsBoolean()
@IsOptional()
active?: boolean;
```

## 2. Padrão para DTOs

### DTOs de Criação (Create)

```typescript
export class CreateExemploDto {
  @ApiPropertyWithExample('Valor de exemplo', {
    description: 'Descrição do campo',
  })
  @IsString({ message: 'Mensagem de erro' })
  @IsNotEmpty({ message: 'Campo obrigatório' })
  campo: string;
}
```

### DTOs de Atualização (Update)

```typescript
export class UpdateExemploDto extends PartialType(CreateExemploDto) {
  @ApiPropertyOptionalWithExample('Novo valor', {
    description: 'Descrição do campo',
  })
  @IsString({ message: 'Mensagem de erro' })
  @IsOptional()
  campo?: string;
}
```

### DTOs de Resposta

```typescript
export class ExemploDto {
  @ApiPropertyWithExample(1, {
    description: 'ID único',
  })
  id: number;

  @ApiPropertyWithExample('Valor de exemplo', {
    description: 'Descrição do campo',
  })
  campo: string;

  @ApiPropertyWithExample('2023-04-20T14:30:00Z', {
    description: 'Data de criação',
  })
  dataCadastro: Date;
}
```

## 3. Controllers

1. Importe os decoradores necessários:

   ```typescript
   import { ApiDocs } from '../../decorators/api-docs.decorator';
   import { HttpStatus } from '@nestjs/common';
   ```

2. Aplique o decorador `@ApiDocs` a cada método do controller:

   ```typescript
   @Get(':id')
   @ApiDocs({
     summary: 'Buscar por ID',
     description: 'Descrição detalhada',
     responseDescription: 'Descrição do retorno',
     responseExampleDto: ExemploDto,
   })
   findOne(@Param('id') id: string) {
     return this.service.findOne(+id);
   }
   ```

3. Padrão para diferentes tipos de endpoints:

   - **GET (lista)**: responseExampleDto para o tipo de retorno
   - **GET (item único)**: responseExampleDto para o tipo de retorno
   - **POST**: requestExampleDto + responseExampleDto + status: HttpStatus.CREATED
   - **PATCH/PUT**: requestExampleDto + responseExampleDto
   - **DELETE**: status: HttpStatus.NO_CONTENT

## 4. Validação

Use os decoradores de validação do `class-validator` com mensagens em português:

```typescript
@IsString({ message: 'O campo deve ser uma string' })
@IsNotEmpty({ message: 'O campo é obrigatório' })
@MinLength(3, { message: 'O campo deve ter no mínimo 3 caracteres' })
@MaxLength(100, { message: 'O campo deve ter no máximo 100 caracteres' })
@IsEmail({}, { message: 'Email inválido' })
@IsEnum(TipoEnum, { message: 'Tipo inválido' })
@IsOptional()
```

## 5. Boas Práticas

- **Nomes significativos**: Use nomes claros para variáveis, métodos e classes
- **Comentários em português**: Adicione comentários explicativos quando necessário
- **Princípios SOLID**:
  - Single Responsibility: Cada classe deve ter apenas uma responsabilidade
  - Open/Closed: Aberto para extensão, fechado para modificação
  - Liskov Substitution: Subclasses devem ser substituíveis por suas classes base
  - Interface Segregation: Interfaces específicas são melhores que uma interface geral
  - Dependency Inversion: Dependa de abstrações, não de implementações concretas
- **Performance**:
  - Use a paginação em listas grandes
  - Aplique índices no banco de dados para campos frequentemente consultados
  - Utilize cache quando apropriado

## 6. Manutenção

Ao adicionar novos módulos ou modificar existentes:

1. Atualize a documentação primeiro
2. Mantenha consistência com os padrões estabelecidos
3. Execute testes para garantir que as mudanças não quebrem funcionalidades existentes
4. Atualize o Swagger para refletir as mudanças na documentação da API

## 7. Exemplo Completo

Veja os módulos `usuario`, `projeto` e `auth` para exemplos completos de implementação seguindo estes padrões.
