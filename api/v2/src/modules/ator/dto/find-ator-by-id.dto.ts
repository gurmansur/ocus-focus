import { ApiProperty } from '@nestjs/swagger';

export class FindAtorByIdDto {
  @ApiProperty({
    description: 'ID do ator',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Nome do ator',
    example: 'Jorge',
  })
  nome: string;

  @ApiProperty({
    description: 'Complexidade do ator',
    type: 'enum',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    example: 'SIMPLES',
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ApiProperty({
    description: 'Descrição do ator',
    example: 'Ator de teste',
  })
  descricao: string;
}
