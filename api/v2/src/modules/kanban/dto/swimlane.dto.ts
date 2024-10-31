import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import { Kanban } from '../entities/kanban.entity';

export class SwimlaneDto {
  id: number;

  nome: string;

  vertical: boolean;

  cor: string;

  criadoEm: Date;

  atualizadoEm: Date;

  kanban: Kanban;

  userStories: UserStory[];
}
