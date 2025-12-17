import { ApiProperty } from '@nestjs/swagger';

export class CasoUsoDto {
  @ApiProperty({
    type: 'string',
    description: 'Nome do caso de uso',
    example: 'Caso de Uso 1',
  })
  nome: string;

  @ApiProperty({
    type: 'enum',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    description: 'Complexidade do caso de uso',
    example: 'SIMPLES',
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ApiProperty({
    type: 'string',
    description: 'Descrição do caso de uso',
    example: 'Descrição do caso de uso 1',
  })
  descricao: string;
}
