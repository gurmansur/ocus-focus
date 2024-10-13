import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCasoDeTesteDto {
  @ApiProperty({
    description: 'Nome do caso de teste',
    example: 'Caso de Teste 1',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Descrição do caso de teste',
    example: 'Descrição do caso de teste 1',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    description: 'Observação do caso de teste',
    example: 'Observação do caso de teste 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  observacoes: string;

  @ApiProperty({
    description: 'Prioridade do caso de teste',
    example: 'ALTA',
    type: 'enum',
    enum: ['ALTA', 'MEDIA', 'BAIXA'],
  })
  @IsEnum(['ALTA', 'MEDIA', 'BAIXA'])
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';

  @ApiProperty({
    description: 'Pré condição do caso de teste',
    example: 'Pré condição do caso de teste 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  preCondicao: string;

  @ApiProperty({
    description: 'Resultado esperado do caso de teste',
    example: 'Resultado esperado do caso de teste 1',
    required: false,
  })
  @IsString()
  @IsOptional()
  posCondicao: string;

  @ApiProperty({
    description: 'Complexidade do caso de teste',
    example: 'SIMPLES',
    type: 'enum',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
  })
  @IsEnum(['SIMPLES', 'MEDIO', 'COMPLEXO'])
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ApiProperty({
    description: 'Status do caso de teste',
    example: 'ATIVO',
    type: 'enum',
    enum: ['ATIVO', 'INATIVO'],
  })
  @IsEnum(['ATIVO', 'INATIVO'])
  status: 'ATIVO' | 'INATIVO';

  @ApiProperty({
    description: 'Resultado esperado do caso de teste',
    example: 'Resultado esperado do caso de teste 1',
  })
  @IsString()
  resultadoEsperado: string;

  @ApiProperty({
    description: 'Método do caso de teste',
    example: 'MANUAL',
    type: 'enum',
    enum: ['MANUAL', 'AUTOMATIZADO'],
  })
  @IsEnum(['MANUAL', 'AUTOMATIZADO'])
  metodo: 'MANUAL' | 'AUTOMATIZADO';

  @ApiProperty({
    description: 'Técnica do caso de teste',
    example: 'FUNCIONAL',
    type: 'enum',
    enum: ['FUNCIONAL', 'ESTRUTURAL'],
  })
  @IsEnum(['FUNCIONAL', 'ESTRUTURAL'])
  tecnica: 'FUNCIONAL' | 'ESTRUTURAL';

  @ApiProperty({
    description: 'Dados de entrada do caso de teste',
    example: 'Dados de entrada do caso de teste 1',
  })
  @IsString()
  dadosEntrada: string;

  @ApiProperty({
    description: 'ID do caso de uso',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  casoDeUsoId: number;

  @ApiProperty({
    description: 'ID da suite de teste',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  suiteDeTesteId?: number;

  @ApiProperty({
    description: 'ID do testador designado',
    example: 1,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  testadorDesignadoId?: number;
}
