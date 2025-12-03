import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para resposta de autenticação com token JWT
 */
export class UserTokenDto {
  @ApiProperty({
    description: 'Mensagem informativa sobre a operação de autenticação',
    example: 'Usuário autenticado com sucesso',
    type: String
  })
  message: string;

  @ApiProperty({
    description: 'ID único do usuário autenticado',
    example: 42,
    type: Number
  })
  usu_id: number;

  @ApiProperty({
    description: 'Nome do usuário autenticado',
    example: 'João da Silva',
    type: String
  })
  usu_name: string;

  @ApiProperty({
    description: 'Email do usuário autenticado',
    example: 'joao.silva@empresa.com',
    type: String
  })
  usu_email: string;

  @ApiProperty({
    description: 'Perfil/papel do usuário no sistema',
    example: 'colaborador',
    enum: ['admin', 'gerente', 'colaborador', 'stakeholder', 'cliente'],
    type: String
  })
  usu_role: string;

  @ApiProperty({
    description: 'Token JWT de autenticação para uso nas requisições subsequentes',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hby5zaWx2YUBlbXByZXNhLmNvbSIsImlhdCI6MTcxMjY0NjQ4MCwiZXhwIjoxNzEyNzMyODgwfQ.5zKUEeGfHvgz9LPdZEQTXqWWjJVHCxjM_XJxj2lcOsA',
    type: String
  })
  accessToken: string;
}
