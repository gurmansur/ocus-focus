import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetExecucaoDeTesteGraficoQueryDto {
  @ApiProperty({
    type: Number,
    description: 'ID da suite de teste',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  suiteId?: number;
}
