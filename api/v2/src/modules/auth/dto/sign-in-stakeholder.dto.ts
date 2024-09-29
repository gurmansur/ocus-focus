import { IsString } from 'class-validator';

export class SignInStakeholderDto {
  @IsString()
  chave: string;

  @IsString()
  senha: string;
}
