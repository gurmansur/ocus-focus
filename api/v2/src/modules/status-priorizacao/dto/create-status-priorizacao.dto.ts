import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateStatusPriorizacaoDto {
  @IsNumber()
@ApiProperty({ description: 'Propriedade stakeholderId' })
  @IsNumber()
  stakeholderId: number
}
