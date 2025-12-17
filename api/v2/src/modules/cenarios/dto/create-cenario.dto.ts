import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateCenarioDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  nome: string;

  @IsEnum(['PRINCIPAL', 'ALTERNATIVO'])
  tipo: 'PRINCIPAL' | 'ALTERNATIVO';

  @IsString()
  @MinLength(5)
  @MaxLength(255)
  descricao: string;

  @IsNumber()
  casoUso: number;
}
