import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRequisitoDto {
  @IsString()
@ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string

  @IsString()
@ApiProperty({ description: 'Propriedade especificacao' })
  @IsString()
  especificacao: string

  @IsNumber()
@ApiProperty({ description: 'Propriedade numeroIdentificador' })
  @IsNumber()
  numeroIdentificador: number
}
