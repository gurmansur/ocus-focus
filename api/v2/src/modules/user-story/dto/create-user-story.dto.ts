import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserStoryDto {
  @IsString()
  titulo: string;

  @IsString()
  descricao: string;

  @IsString()
  estimativa_tempo: string;

  @IsOptional()
  @IsNumber()
  kanban?: number;

  @IsOptional()
  @IsNumber()
  responsavel?: number;

  @IsOptional()
  @IsNumber()
  swimlaneId?: number;

  @IsOptional()
  @IsString()
  swimlane?: string;

  @IsOptional()
  @IsString()
  prioridade?: string;

  @IsOptional()
  @IsString()
  dataVencimento?: string;
}
