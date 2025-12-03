import { IsString, IsOptional, IsNumber, IsBoolean, IsEmail, IsEnum, IsArray, IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStory } from '../../user-story/entities/user-story.entity';

export class SprintDto {
@ApiProperty({ description: 'Propriedade id' })
  @IsNumber()
  id: number

@ApiProperty({ description: 'Propriedade nome' })
  @IsString()
  nome: string

@ApiProperty({ description: 'Propriedade descricao' })
  @IsString()
  descricao: string

@ApiProperty({ description: 'Propriedade horas_previstas' })
  @IsNumber()
  horas_previstas: number

@ApiProperty({ description: 'Propriedade data_inicio' })
  @IsDate()
  data_inicio: Date

@ApiProperty({ description: 'Propriedade data_fim' })
  @IsDate()
  data_fim: Date

@ApiProperty({ description: 'Propriedade userStories' })
  @IsArray()
  userStories: UserStory[] | null
}
