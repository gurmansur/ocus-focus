export class Comentario {
  constructor(
    public comentario: string,
    public nome_usuario: string,
    public user_story_id: number,
    public id?: number
  ) {}
}
