import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { UsuarioDto } from '../../usuario/dto/usuario.dto';

/**
 * DTO para resposta de registro de novo usuário
 */
export class SignUpResponseDto {
  @ApiProperty({
    description: 'ID único do usuário registrado',
    example: 42,
    type: Number
  })
  id: number;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João da Silva',
    type: String
  })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário (único no sistema)',
    example: 'joao.silva@empresa.com',
    type: String
  })
  email: string;

  @Exclude()
  senha: string;

  @ApiProperty({
    description: 'Nome da empresa do usuário',
    example: 'TechSolutions Ltda.',
    type: String
  })
  empresa: string;

  @ApiProperty({
    description: 'Cargo ou função do usuário na empresa',
    example: 'Desenvolvedor Sênior',
    type: String
  })
  cargo: string;

  @ApiProperty({
    description: 'Data de cadastro do usuário no sistema',
    example: '2023-04-15T14:30:45.000Z',
    type: Date
  })
  dataCadastro: Date;

  @ApiProperty({
    description: 'Token JWT de autenticação gerado após o cadastro',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiIsIm5hbWUiOiJKb8OjbyBkYSBTaWx2YSIsImVtYWlsIjoiam9hby5zaWx2YUBlbXByZXNhLmNvbSIsImlhdCI6MTcxMjY0NjQ4MCwiZXhwIjoxNzEyNzMyODgwfQ.5zKUEeGfHvgz9LPdZEQTXqWWjJVHCxjM_XJxj2lcOsA',
    type: String
  })
  accessToken: string;

  @ApiProperty({
    description: 'Usuário',
    type: UsuarioDto,
  })
  usuario: UsuarioDto;
  perfil: any;
}
