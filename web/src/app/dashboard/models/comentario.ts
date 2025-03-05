export class Comentario {
  constructor(
    public comentario: string,
    public fk_usuario_id: number,
    public fk_user_story: number,
    public criado_em?: Date,
    public modificado_em?: Date | null,
    public deletado?: boolean,
    public id?: number
  ) {}
}
