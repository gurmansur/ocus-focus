export class UserStory {
  constructor(
    public titulo: string = '',

    public descricao: string = '',

    public estimativa_tempo: number = 0,

    public criado_em: string = '',

    public modificado_em: string = '',

    public comentarios: string[] = [''],

    public prazo: string = new Date().toISOString().split('T')[0],

    public swimlane: number = 0,

    public id?: number
  ) {}
}
