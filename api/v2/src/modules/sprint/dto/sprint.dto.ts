import { UserStory } from 'src/modules/user-story/entities/user-story.entity';

export class SprintDto {
  id: number;

  nome: string;

  descricao: string;

  horas_previstas: number;

  data_inicio: Date;

  data_fim: Date;

  userStories: UserStory[] | null;
}
