import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateProjetoDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsString()
  @IsOptional()
  empresa?: string;

  @IsDateString()
  @IsOptional()
  dataInicio?: Date;

  @IsDateString()
  @IsOptional()
  previsaoFim?: Date;

  @IsEnum(['EM ANDAMENTO', 'FINALIZADO', 'CANCELADO'])
  @IsOptional()
  status?: 'EM ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
}
