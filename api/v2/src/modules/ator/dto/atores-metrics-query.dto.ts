import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class AtoresMetricsQueryDto {
  @ApiProperty({
    description: 'ID do projeto',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  atores: number;
}
