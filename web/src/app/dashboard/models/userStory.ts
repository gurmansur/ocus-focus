export class UserStory {
  constructor(
    public titulo: string = '',

    public descricao: string = '',

    public estimativa_tempo: number = -1,

    public criado_em: string = '',

    public modificado_em: string = '',

    public criador: number = -1,

    public responsavel: number | string = -1,

    public swimlane: number = -1,

    public id?: number,

    public requisitos?: any[],

    public sprints?: any[],

    public casosDeUso?: any[],
  ) {}
}
