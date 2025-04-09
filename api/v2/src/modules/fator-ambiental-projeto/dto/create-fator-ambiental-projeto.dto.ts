import { IsNumber } from 'class-validator';

export class CreateFatorAmbientalProjetoDto {
  @IsNumber()
  valor: number;

  @IsNumber()
  fatorAmb: number;

  @IsNumber()
  fatorPro: number;
}
