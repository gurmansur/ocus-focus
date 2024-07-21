export class PlanoDeTeste {
  constructor(
    public nome: string,
    public descricao: string,
    public data: string,
    public status: string,
    public observacoes?: string,
    public id?: number
  ) {}
}
