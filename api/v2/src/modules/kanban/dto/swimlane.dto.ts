import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class SwimlaneDto {
  @IsString()
  @ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string;

  @IsString()
  @ApiProperty({ description: 'Propriedade cor' })
  @IsString()
  cor: string;

  @ApiProperty({ description: 'Propriedade kanban' })
  @IsNumber()
  kanban: number;
}
