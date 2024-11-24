import { UserStoryBo } from '../../user-story/bo/user-story.bo';

export class SprintBo {
  id: number;

  nome: string;

  descricao: string;

  horas_previstas: number;

  data_inicio: Date;

  data_fim: Date;

  userStories: UserStoryBo[] | null;
}
