import { Arquivo } from '../../arquivo/entities/arquivo.entity';
import { Kanban } from '../../kanban/entities/kanban.entity';
import { Swimlane } from '../../kanban/entities/swimlane.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Sprint } from '../../sprint/entities/sprint.entity';
import { Subtarefa } from '../../subtarefa/entities/subtarefa.entity';
import { Tag } from '../../tag/entities/tag.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
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
