import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class CreateResultadoRequisitoDto {
@ApiProperty({ description: 'Propriedade requisitoId' })
  @IsNumber()
  requisitoId: number
@ApiProperty({ description: 'Propriedade resultadoFinal' })
  resultadoFinal: 
    | 'DEVE SER FEITO'
    | 'PERFORMANCE'
    | 'ATRATIVO'
    | 'INDIFERENTE'
    | 'QUESTIONAVEL'
    | 'REVERSO';
}
