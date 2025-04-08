import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class UpdateSwimlaneUsDto {
  @IsArray()
@ApiProperty({ description: 'Propriedade userStories' })
  @IsNumber()
  userStories: number[]

  @IsNumber()
@ApiProperty({ description: 'Propriedade id' })
  @IsNumber()
  id: number
}
