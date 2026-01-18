import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { StatusAssinatura, TipoPeriodo } from '../entities/assinatura.entity';

export class UpdateAssinaturaDto {
  @ApiProperty({
    example: 'ATIVA',
    enum: StatusAssinatura,
    required: false,
  })
  @IsOptional()
  @IsEnum(StatusAssinatura)
  status?: StatusAssinatura;

  @ApiProperty({
    example: 'ANUAL',
    enum: TipoPeriodo,
    required: false,
  })
  @IsOptional()
  @IsEnum(TipoPeriodo)
  tipoPeriodo?: TipoPeriodo;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  autoRenovacao?: boolean;
}
