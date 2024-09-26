import { IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  nome: string;

  @IsString()
  email: string;

  @IsString()
  empresa: string;

  @IsString()
  cargo: string;

  @IsString()
  senha: string;

  @IsString()
  confirmarSenha: string;
}
