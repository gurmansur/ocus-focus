import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsOptional } from 'class-validator';
import { TipoPeriodo } from '../entities/assinatura.entity';

export class CreateAssinaturaDto {
  @ApiProperty({ example: 1, description: 'ID do plano' })
  @IsNumber()
  planoId: number;

  @ApiProperty({
    example: 'MENSAL',
    enum: TipoPeriodo,
    description: 'Tipo de período da assinatura',
  })
  @IsEnum(TipoPeriodo)
  tipoPeriodo: TipoPeriodo;

  @ApiProperty({
    example: 1,
    description: 'ID do projeto (opcional)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  projetoId?: number;

  @ApiProperty({
    example: true,
    description: 'Indica se é período de trial',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  trial?: boolean;

  @ApiProperty({
    example: true,
    description: 'Habilitar auto-renovação',
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  autoRenovacao?: boolean;
}
