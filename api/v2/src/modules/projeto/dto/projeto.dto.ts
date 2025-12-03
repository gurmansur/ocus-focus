import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export class ProjetoDto {
@ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string

@ApiProperty({ description: 'Propriedade descricao' })
  @IsString()
  descricao: string

@ApiProperty({ description: 'Propriedade empresa' })
  @IsString()
  empresa: string

@ApiProperty({ description: 'Propriedade dataInicio' })
  @IsDate()
  dataInicio: Date

@ApiProperty({ description: 'Propriedade previsaoFim' })
  @IsDate()
  previsaoFim: Date

@ApiProperty({ description: 'Propriedade status' })
  status: 'EM ANDAMENTO' | 'FINALIZADO' | 'CANCELADO'
}
