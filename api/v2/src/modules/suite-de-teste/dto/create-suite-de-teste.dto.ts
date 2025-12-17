import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSuiteDeTesteDto {
  @ApiProperty({
    type: 'string',
    description: 'Nome da suite de teste',
    example: 'Suite de teste 1',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    type: 'enum',
    description: 'Status da suite de teste',
    example: 'ATIVO',
    enum: ['ATIVO', 'INATIVO'],
  })
  @IsEnum(['ATIVO', 'INATIVO'])
  @IsOptional()
  status: 'ATIVO' | 'INATIVO';

  @ApiProperty({
    type: 'string',
    description: 'Descrição da suite de teste',
    example: 'Descrição da suite de teste 1',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    type: 'string',
    description: 'Observações da suite de teste',
    example: 'Observações da suite de teste 1',
  })
  @IsString()
  @IsOptional()
  observacoes: string;

  @ApiProperty({
    type: 'number',
    description: 'Id da suite de teste pai',
    example: 1,
  })
  @Transform(({ value }) => (!value && value !== 0 ? null : parseInt(value)))
  @IsNumber()
  @IsOptional()
  suitePaiId: number;
}
