import { ApiProperty } from '@nestjs/swagger';

export class TokenVerificationDto {
  @ApiProperty({
    description: 'Booleano que indica se o token é válido',
    example: true,
  })
  auth: boolean;

  @ApiProperty({
    description: 'Mensagem de validação',
    example: 'Token válido.',
  })
  message: string;
}
