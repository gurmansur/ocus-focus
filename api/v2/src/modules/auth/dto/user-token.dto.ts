import { ApiProperty } from '@nestjs/swagger';

export class UserTokenDto {
  @ApiProperty({
    description: 'Mensagem de sucesso',
    example: 'Usuário autenticado com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Token de acesso',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VfZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c3VfbmFtZSI6IkFkbWluIiwidXN1X2lkIjoxLCJ1c3Vfcm9sZSI6IkFkbWluIiwiaWF0IjoxNjE4MjI5NzY2LCJleHAiOjE2MTgzMTYxNjZ9.1J2zH6mX1iRb4zvz2H4J8W4Kq2p2vXq1YK3n3J4n3J4',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'teste@teste.com',
  })
  usu_email: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'Teste',
  })
  usu_name: string;

  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  usu_id: number;

  @ApiProperty({
    description: 'Role do usuário',
    example: 'colaborador',
    type: 'enum',
    enum: ['stakeholder', 'colaborador'],
  })
  usu_role: 'stakeholder' | 'colaborador';
}
