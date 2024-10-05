import { ApiProperty } from '@nestjs/swagger';

export class FindAtorByNomeDto {
  @ApiProperty({
    description: 'Itens encontrados na busca',
    example: [
      {
        id: 1,
        nome: 'Exemplo',
        complexidade: 'SIMPLES',
        descricao: 'Este é um exemplo de ator entitulado Exemplo',
      },
      {
        id: 2,
        nome: 'Exemplo 2',
        complexidade: 'COMPLEXO',
        descricao: 'Este é um exemplo de ator entitulado Exemplo 2',
      },
    ],
  })
  items: Array<{
    id: number;
    nome: string;
    complexidade: string;
    descricao: string;
  }>;

  @ApiProperty({
    description: 'Informações da paginação',
    example: {
      size: '5',
      totalElements: 2,
      totalPages: 1,
      number: '0',
    },
  })
  page: {
    size: string;
    totalElements: number;
    totalPages: number;
    number: string;
  };
}
