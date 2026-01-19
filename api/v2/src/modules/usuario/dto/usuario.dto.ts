import { ApiProperty } from '@nestjs/swagger';

export class UsuarioDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João Silva',
  })
  nome: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Empresa do usuário',
    example: 'Empresa XYZ',
  })
  empresa: string;

  @ApiProperty({
    description: 'Cargo do usuário',
    example: 'Desenvolvedor',
  })
  cargo: string;

  @ApiProperty({
    description: 'Data de cadastro do usuário',
    example: '2021-10-10T00:00:00.000Z',
  })
  dataCadastro: Date;
}
