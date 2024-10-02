import { IsNumber } from 'class-validator';

export class CreateFatorTecnicoProjetoDto {
  @IsNumber()
  valor: number;

  @IsNumber()
  fatorTec: number;
}
