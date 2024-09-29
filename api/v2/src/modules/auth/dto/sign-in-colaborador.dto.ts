import { IsString } from 'class-validator';

export class SignInColaboradorDto {
  @IsString()
  email: string;

  @IsString()
  senha: string;
}
