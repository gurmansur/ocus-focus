import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsNumber()
  horas_previstas: number;

  @IsDateString()
  data_inicio: string;

  @IsDateString()
  data_fim: string;
}
