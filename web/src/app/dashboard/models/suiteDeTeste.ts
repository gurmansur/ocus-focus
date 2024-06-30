import { PlanoDeTeste } from './planoDeTeste';

export class SuiteDeTeste {
  constructor(
    public nome: string,
    public descricao: string,
    public status: string,
    public observacoes?: string,
    public planoDeTeste?: PlanoDeTeste,
    public id?: number
  ) {}
}
