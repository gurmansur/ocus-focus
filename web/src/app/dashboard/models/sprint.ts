import { UserStory } from './userStory';

export class Sprint {
  constructor(
    public nome: string = '',
    public descricao: string = '',
    public horas_previstas: number = 0,
    public data_inicio?: Date,
    public data_fim?: Date,
    public userStories: UserStory[] = [],
    public id?: number,
  ) {}
}
