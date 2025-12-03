import { IsAlphanumeric } from 'class-validator';

export class CreateFatorTecnicoProjetoDto {
  @IsAlphanumeric()
  valor: number;

  @IsAlphanumeric()
  fatorTec: number;
}
