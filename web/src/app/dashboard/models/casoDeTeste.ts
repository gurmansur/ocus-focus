import { Colaborador } from './colaborador';
import { SuiteDeTeste } from './suiteDeTeste';

export class CasoDeTeste {
  constructor(
    public nome: string,
    public descricao: string,
    public prioridade: string,
    public complexidade: string,
    public tipo: string,
    public status: string,
    public dataCriacao: string,
    public resultadoEsperado: string,
    public passos: string,
    public observacoes?: string,
    public preCondicoes?: string,
    public posCondicoes?: string,
    public suite?: SuiteDeTeste,
    public testador?: Colaborador,
    public id?: number
  ) {}
}
