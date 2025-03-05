import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateComentarioDto {
  @ApiProperty({
    description: 'Comentário a ser salvo',
    type: 'string',
    example: 'Comentário de exemplo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  comentario: string;

  @ApiProperty({
    description: 'Id do usuário que fez o comentário',
    type: 'integer',
    example: 1,
    required: true,
  })
  @IsNumber()
  usuario_id: number;

  @ApiProperty({
    description: 'Id da user story que o comentário pertence',
    type: 'integer',
    example: 1,
    required: true,
  })
  @IsNumber()
  user_story_id: number;
}
