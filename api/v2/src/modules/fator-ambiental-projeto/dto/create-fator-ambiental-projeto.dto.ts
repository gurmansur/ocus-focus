import { IsInt } from 'class-validator';

export class CreateFatorAmbientalProjetoDto {
  @IsInt()
  valor: number;

  @IsInt()
  fatorAmb: number;
}
