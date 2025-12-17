import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdateAtorQueryDto {
  @ApiProperty({
    description: 'ID do ator',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  atores: number;

  @ApiProperty({
    description: 'ID do projeto',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  projeto: number;
}
