import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  CasoResultadoPayload,
  RodadaDeTesteStatus,
} from '../entities/rodada-de-teste.entity';
import { TestRunResultDto } from './test-run-result.dto';

export class CreateRodadaDeTesteDto {
  @ApiProperty({ description: 'Nome da rodada de teste' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  nome: string;

  @ApiProperty({
    enum: ['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ABORTADO'],
    default: 'NAO_INICIADO',
    required: false,
  })
  @IsEnum(['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ABORTADO'])
  @IsOptional()
  status?: RodadaDeTesteStatus;

  @ApiProperty({ description: 'IDs dos casos de teste', type: [String] })
  @IsArray()
  @IsString({ each: true })
  casosIds: string[];

  @ApiProperty({ description: 'Ambiente de execução', required: false })
  @IsOptional()
  @IsString()
  ambiente?: string;

  @ApiProperty({ description: 'Responsável', required: false })
  @IsOptional()
  @IsString()
  responsavel?: string;

  @ApiProperty({ description: 'Data de início', required: false })
  @IsOptional()
  @IsDateString()
  dataInicio?: string;

  @ApiProperty({ description: 'Data de conclusão', required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: string;

  @ApiProperty({
    description: 'Resultados por caso de teste',
    type: [TestRunResultDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  resultados?: CasoResultadoPayload[];
}
