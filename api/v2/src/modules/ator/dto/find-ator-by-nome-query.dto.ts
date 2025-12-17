import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

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
  @IsNumberString()
  projeto: number;

  @ApiProperty({
    description: 'Número da página',
    example: 1,
  })
  @IsNumberString()
  page: number;

  @ApiProperty({
    description: 'Numero de itens por página',
    example: 10,
  })
  @IsNumberString()
  pageSize: number;
}
