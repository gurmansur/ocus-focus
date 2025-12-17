import { CasoDeTeste } from './casoDeTeste';

export class SuiteDeTeste {
  constructor(
    public nome: string,

    public status: 'ATIVO' | 'INATIVO',

    public descricao: string,

    public observacoes: string,

    public suitePaiId: number,

    public suitesFilhas: SuiteDeTeste[],

    public casosDeTeste: CasoDeTeste[],

    public id?: number,
  ) {}
}
