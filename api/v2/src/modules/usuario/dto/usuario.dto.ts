import { ApiProperty } from '@nestjs/swagger';

export class UsuarioDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Data de cadastro do usuário',
    example: '2021-10-10T00:00:00.000Z',
  })
  dataCadastro: Date;
}
