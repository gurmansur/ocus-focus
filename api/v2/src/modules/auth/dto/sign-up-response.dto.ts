import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({
    description: 'Empresa do colaborador',
    example: 'Empresa Teste',
  })
  empresa: string;

  @ApiProperty({
    description: 'Cargo do colaborador',
    example: 'Desenvolvedor',
  })
  cargo: string;

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
}
