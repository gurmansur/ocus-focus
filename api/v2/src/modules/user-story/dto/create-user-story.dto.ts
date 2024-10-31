import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { KanbanDto } from 'src/modules/kanban/dto/kanban.dto';
import { SwimlaneDto } from 'src/modules/kanban/dto/swimlane.dto';
import { ProjetoDto } from 'src/modules/projeto/dto/projeto.dto';
import { UsuarioDto } from 'src/modules/usuario/dto/usuario.dto';

export class CreateUserStoryDto {
  @ApiProperty({
    type: 'string',
    description: 'Descrição da User Story',
    example:
      'O usuário autenticado consegue logar no sistema e acessar seu perfil',
  })
  @IsString()
  descricao: string;

  @ApiProperty({
    type: 'number',
    description: 'Estimativa da User Story',
    example: '7',
  })
  @IsNumber()
  estimativa_tempo: number;

  @ApiProperty({
    type: 'string',
    description: 'Titulo da User Story',
    example: 'Acessar o próprio perfil',
  })
  @IsString()
  titulo: string;

  @ApiProperty({
    type: 'number',
    description: 'Id do kanban do projeto',
    example: '1',
  })
  kanban: KanbanDto;

  @ApiProperty({
    type: 'number',
    description: 'Id do usuário que criou a user story',
    example: '1',
  })
  criador: UsuarioDto;

  @ApiProperty({
    type: 'number',
    description: 'Id da swimlane que a user story está',
    example: '1',
  })
  swimlane: SwimlaneDto;

  @ApiProperty({
    type: 'number',
    description: 'Id do projeto que a user story está',
    example: '1',
  })
  projeto: ProjetoDto;
}
