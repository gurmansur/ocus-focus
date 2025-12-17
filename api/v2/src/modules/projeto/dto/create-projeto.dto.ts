import { IsDateString, IsEnum, IsString } from 'class-validator';

export class CreateProjetoDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsString()
  empresa: string;

  @IsDateString()
  dataInicio: Date;

  @IsDateString()
  previsaoFim: Date;

  @IsEnum(['EM ANDAMENTO', 'FINALIZADO', 'CANCELADO'])
  status: 'EM ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
}
