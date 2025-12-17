import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInStakeholderDto {
  @ApiProperty({
    description: 'Chave do stakeholder',
    example: '21e1bbf8af3b3c8bb37f0104672df1f4c6ff9c84',
  })
  @IsString()
  chave: string;

  @ApiProperty({
    description: 'Senha do stakeholder',
    example: 'Abcd1234!',
  })
  @IsString()
  senha: string;
}
