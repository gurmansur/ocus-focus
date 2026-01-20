import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UsuarioDto } from '../../usuario/dto/usuario.dto';

export class SignUpResponseDto {
  @ApiProperty({
    description: 'Nome do colaborador',
    example: 'João da Silva',
  })
  nome: string;

  @ApiProperty({
    description: 'Email do colaborador',
    example: 'teste@teste.com',
  })
  email: string;

  @Exclude()
  senha: string;

  @ApiPropertyOptional({
    description: 'Empresa do colaborador',
    example: 'Empresa Teste',
  })
  empresa?: string;

  @ApiPropertyOptional({
    description: 'Cargo do colaborador',
    example: 'Desenvolvedor',
  })
  cargo?: string;

  @ApiProperty({
    description: 'Usuário',
    type: UsuarioDto,
  })
  usuario: UsuarioDto;

  @ApiProperty({
    description: 'ID do colaborador',
    example: 8,
  })
  id: number;

  @ApiProperty({
    description: 'Data de cadastro',
    example: '2021-10-10T00:00:00.000Z',
  })
  dataCadastro: Date;

  @ApiProperty({
    description: 'Token de acesso JWT',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VfZW1haWwiOiJhZG1pbkBnbWFpbC5jb20iLCJ1c3VfbmFtZSI6IkFkbWluIiwidXN1X2lkIjoxLCJ1c3Vfcm9sZSI6ImNvbGFib3JhZG9yIiwiaWF0IjoxNjE4MjI5NzY2LCJleHAiOjE2MTgzMTYxNjZ9.1J2zH6mX1iRb4zvz2H4J8W4Kq2p2vXq1YK3n3J4n3J4',
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
