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

  @IsNumberString()
  projeto_id: number;
}
