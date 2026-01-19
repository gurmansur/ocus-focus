/**
 * @deprecated This module is deprecated. Please use the 'usuario' module instead.
 */
import { IsNumberString, IsString } from 'class-validator';

export class CreateStakeholderDto {
  @IsString()
  nome: string;

  @IsString()
  email: string;

  @IsString()
  cargo: string;

  @IsString()
  senha: string;

  @IsString()
  confirmarSenha: string;

  @IsString()
  chave: string;

  @IsNumberString()
  projeto_id: number;
}
