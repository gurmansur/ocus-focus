import {
  IsEnum,
  IsObject,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';

export class CreateAtorDto {
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

  @IsObject()
  projeto: Projeto;
}
