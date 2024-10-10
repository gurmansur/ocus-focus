import { IsNumberString } from 'class-validator';

export class CreateFatorAmbientalProjetoDto {
  @IsNumberString()
  valor: number;

  @IsNumberString()
  fatorAmb: number;

  @IsNumberString()
  fatorPro: number;
}
