import { ApiProperty } from '@nestjs/swagger';

export class AtoresMetricsDto {
  @ApiProperty({
    description: 'Total de atores dentro da categoria',
    example: 1,
  })
  totalCount: number;
}
