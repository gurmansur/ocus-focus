import { IsString } from 'class-validator';

export class SwimlaneDto {
  @IsString()
  nome: string;

  @IsString()
  cor: string;

  kanban: number;
}
