import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCasoUsoDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  nome: string;

  @IsEnum(['SIMPLES', 'MEDIO', 'COMPLEXO'])
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  descricao: string;
}
