import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { PlanoDeTesteStatus } from '../entities/plano-de-teste.entity';

export class CreatePlanoDeTesteDto {
  @ApiProperty({ description: 'Nome do plano de teste' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nome: string;

  @ApiProperty({ description: 'Descrição do plano de teste' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descricao: string;

  @ApiProperty({
    description: 'Status do plano de teste',
    enum: ['RASCUNHO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO'],
    default: 'RASCUNHO',
    required: false,
  })
  @IsEnum(['RASCUNHO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO'])
  @IsOptional()
  status?: PlanoDeTesteStatus;

  @ApiProperty({ description: 'Ambiente alvo', required: false })
  @IsString()
  @IsOptional()
  ambiente?: string;

  @ApiProperty({ description: 'Data alvo para conclusão', required: false })
  @IsDateString()
  @IsOptional()
  dataAlvo?: string;

  @ApiProperty({ description: 'Data de início planejada', required: false })
  @IsDateString()
  @IsOptional()
  dataInicio?: string;

  @ApiProperty({ description: 'IDs das suites de teste', type: [Number] })
  @IsArray()
  @ArrayNotEmpty()
  suitesIds: number[];

  @ApiProperty({ description: 'Responsáveis', type: [String], required: false })
  @IsArray()
  @IsOptional()
  responsaveis?: string[];
}
