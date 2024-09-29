import { IsNumber, IsString } from 'class-validator';

export class CreateRequisitoDto {
  @IsString()
  nome: string;

  @IsString()
  especificacao: string;

  @IsNumber()
  numeroIdentificador: number;
}
