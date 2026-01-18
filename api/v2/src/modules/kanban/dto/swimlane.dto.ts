import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SwimlaneDto {
  @ApiProperty({ description: 'Nome da swimlane' })
  @IsString()
  nome: string;

  @ApiProperty({
    description: 'Cor da swimlane em formato hexadecimal',
    example: '#6d28d9',
  })
  @IsString()
  cor: string;

  @ApiProperty({
    description: 'Ícone da swimlane',
    required: false,
    example: 'Clock',
  })
  @IsOptional()
  @IsString()
  icone?: string;

  @ApiProperty({ description: 'ID do kanban' })
  kanban: number;
}
