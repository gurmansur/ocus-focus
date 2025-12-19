import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSprintDto {
  @IsString()
  nome: string;

  @IsString()
  descricao: string;

  @IsNumber()
  horas_previstas: number;

  @IsOptional()
  @IsDateString()
  data_inicio?: string;

  @IsOptional()
  @IsDateString()
  data_fim?: string;
}
