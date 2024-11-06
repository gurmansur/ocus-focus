import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Arquivo } from 'src/modules/arquivo/entities/arquivo.entity';
import { Colaborador } from 'src/modules/colaborador/entities/colaborador.entity';
import { KanbanDto } from 'src/modules/kanban/dto/kanban.dto';
import { SwimlaneDto } from 'src/modules/kanban/dto/swimlane.dto';
import { Kanban } from 'src/modules/kanban/entities/kanban.entity';
import { Swimlane } from 'src/modules/kanban/entities/swimlane.entity';
import { ProjetoDto } from 'src/modules/projeto/dto/projeto.dto';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { SprintDto } from 'src/modules/sprint/dto/sprint.dto';
import { Sprint } from 'src/modules/sprint/entities/sprint.entity';
import { Subtarefa } from 'src/modules/subtarefa/entities/subtarefa.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Comentario } from '../entities/comentario.entity';

export class UserStoryDto {
  @ApiProperty({
    type: 'number',
    description: 'Id da user story',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Título da user story',
    example: 'User Story de Teste',
  })
  titulo: string;

  @ApiProperty({
    type: 'string',
    description: 'Descrição da user story',
    example: 'Descrição da user story de teste',
  })
  descricao: string;

  @ApiProperty({
    type: 'number',
    description: 'Estimativa de tempo pra concluir a user story',
    example: 4,
  })
  estimativa_tempo: number;

  @ApiProperty({
    type: [Comentario],
    description: 'Comnetários feito na User Story',
  })
  comentarios: Comentario[];

  @ApiProperty({
    type: [Tag],
    description: 'Tags da user story',
  })
  tags: Tag[];

  @ApiProperty({
    type: [Subtarefa],
    description: 'Subtarefas (DoD) da user story',
  })
  subtarefas: Subtarefa[];

  @ApiProperty({
    type: [Arquivo],
    description: 'Arquivos da User Story',
  })
  arquivos: Arquivo[];

  @ApiProperty({
    type: [Colaborador],
    description: 'Usuário criador da user story',
  })
  criador: Colaborador;

  @ApiProperty({
    type: [Colaborador],
    description: 'Usuário responsável pela realização da user story',
  })
  responsavel: Colaborador;

  @ApiProperty({
    type: [Colaborador],
    description: 'Participantes da User Story',
  })
  participantes: Colaborador[];

  @ApiProperty({
    type: [Kanban],
    description: 'Kanban em que a user story vai ficar',
  })
  @Type(() => KanbanDto)
  kanban: Kanban;

  @ApiProperty({
    type: [Projeto],
    description: 'Projeto que a user story vai ficar',
  })
  @Type(() => ProjetoDto)
  projeto: Projeto;

  @ApiProperty({
    type: [Sprint],
    description: 'Sprint que a user story vai ser realizada',
  })
  @Type(() => SprintDto)
  sprints: Sprint;

  @ApiProperty({
    type: [Swimlane],
    description: 'Swimlane que a user story está',
  })
  @Type(() => SwimlaneDto)
  swimlane: Swimlane;

  @ApiProperty({
    type: 'timestamp',
    description: 'Data de criação da user story',
    example: '2024-10-27 02:45:22',
  })
  criado_em: Date;

  @ApiProperty({
    type: 'timestamp',
    description: 'Data da última modificação da user story',
    example: '2024-10-27 02:45:22',
  })
  modificado_em: Date;
}
