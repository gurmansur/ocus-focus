import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para resposta de verificação de token
 */
export class TokenVerificationDto {
  @ApiProperty({
    description: 'Indica se o token é válido e está autenticado',
    example: true,
    type: Boolean,
  })
  auth: boolean;

  @ApiProperty({
    description: 'Mensagem informativa sobre o status do token',
    example: 'Token válido.',
    type: String,
  })
  message: string;
}
