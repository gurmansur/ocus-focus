import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCenarioDto {
  @IsString()
  @MinLength(5)
  @MaxLength(100)
@ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string

  @IsEnum(['PRINCIPAL', 'ALTERNATIVO'])
@ApiProperty({ description: 'Propriedade tipo' })
  tipo: 'PRINCIPAL' | 'ALTERNATIVO'

  @IsString()
  @MinLength(5)
  @MaxLength(255)
@ApiProperty({ description: 'Propriedade descricao' })
  @IsString()
  descricao: string
}
