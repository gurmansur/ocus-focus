import { CasoDeTeste } from './casoDeTeste';

export class SuiteDeTeste {
  constructor(
    public id: number,

    public nome: string,

    public status: 'ATIVO' | 'INATIVO',

    public descricao: string,

    public observacoes: string,

    public suitePai: SuiteDeTeste,

    public suitesFilhas: SuiteDeTeste[],

    public casosDeTeste: CasoDeTeste[]
  ) {}
}
