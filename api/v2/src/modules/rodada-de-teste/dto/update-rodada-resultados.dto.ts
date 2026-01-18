import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsOptional } from 'class-validator';
import {
  CasoResultadoPayload,
  RodadaDeTesteStatus,
} from '../entities/rodada-de-teste.entity';
import { TestRunResultDto } from './test-run-result.dto';

export class UpdateRodadaResultadosDto {
  @ApiProperty({ type: [TestRunResultDto] })
  @IsArray()
  resultados: CasoResultadoPayload[];

  @ApiProperty({
    enum: ['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ABORTADO'],
    required: false,
  })
  @IsEnum(['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ABORTADO'])
  @IsOptional()
  status?: RodadaDeTesteStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dataFim?: string;
}
