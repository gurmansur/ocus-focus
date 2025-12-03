import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNumberString } from 'class-validator';

export class CreateFatorAmbientalProjetoDto {
  @IsNumberString()
  @ApiProperty({ description: 'Propriedade valor' })
  @IsNumber()
  valor: number;

  @IsNumberString()
  @ApiProperty({ description: 'Propriedade fatorAmb' })
  @IsNumber()
  fatorAmb: number;

  @IsNumberString()
  @ApiProperty({ description: 'Propriedade fatorPro' })
  @IsNumber()
  fatorPro: number;

  @IsNumberString()
  @ApiProperty({ description: 'Propriedade projetoId' })
  @IsNumber()
  projetoId: number;
}
