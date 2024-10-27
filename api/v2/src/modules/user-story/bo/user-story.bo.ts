import { Arquivo } from 'src/modules/arquivo/entities/arquivo.entity';
import { Kanban } from 'src/modules/kanban/entities/kanban.entity';
import { Swimlane } from 'src/modules/kanban/entities/swimlane.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { Sprint } from 'src/modules/sprint/entities/sprint.entity';
import { Subtarefa } from 'src/modules/subtarefa/entities/subtarefa.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Comentario } from '../entities/comentario.entity';

export class UserStoryBo {
  id: number;
  titulo: string;
  descricao: string;
  estimativa_tempo: number;
  comentarios: Comentario[];
  tags: Tag[];
  subtarefas: Subtarefa[];
  arquivos: Arquivo[];
  criador: Usuario;
  responsavel: Usuario;
  participantes: Usuario[];
  kanban: Kanban;
  projeto: Projeto;
  sprints: Sprint;
  swimlane: Swimlane;
  criado_em: Date;
  modificado_em: Date;
}
