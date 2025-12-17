import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInColaboradorDto {
  @ApiProperty({
    description: 'Email do colaborador',
    example: 'teste@teste.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Senha do colaborador',
    example: 'Abcd1234!',
  })
  @IsString()
  senha: string;
}
