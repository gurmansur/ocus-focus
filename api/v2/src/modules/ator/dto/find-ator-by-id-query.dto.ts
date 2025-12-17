import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindAtorByIdQueryDto {
  @ApiProperty({
    description: 'ID do ator',
    example: 1,
  })
  @Transform(({ value }) => +value)
  @IsNumber()
  id: number;
}
