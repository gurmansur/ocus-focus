import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FindAtorByNomeQueryDto {
  @ApiProperty({
    description: 'Nome do ator',
    example: 'João',
  })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'ID do projeto',
    example: 1,
  })
  @IsNumber()
  projeto: number;

  @ApiProperty({
    description: 'Número da página',
    example: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Numero de itens por página',
    example: 10,
  })
  @IsNumber()
  pageSize: number;
}
