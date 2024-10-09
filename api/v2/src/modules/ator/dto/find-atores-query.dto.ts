import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class FindAtoresQueryDto {
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
  size: number;
}
