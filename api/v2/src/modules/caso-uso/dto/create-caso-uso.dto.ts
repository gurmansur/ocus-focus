import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCasoUsoDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
@ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string

  @IsEnum(['SIMPLES', 'MEDIO', 'COMPLEXO'])
@ApiProperty({ description: 'Propriedade complexidade' })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO'

  @IsString()
  @MinLength(5)
  @MaxLength(255)
@ApiProperty({ description: 'Propriedade descricao' })
  @IsString()
  descricao: string
}
