import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsAlphanumeric, IsNumber } from 'class-validator';

export class CreateFatorTecnicoProjetoDto {
  @IsAlphanumeric()
@ApiProperty({ description: 'Propriedade valor' })
  @IsNumber()
  valor: number

  @IsAlphanumeric()
@ApiProperty({ description: 'Propriedade fatorTec' })
  @IsNumber()
  fatorTec: number
}
