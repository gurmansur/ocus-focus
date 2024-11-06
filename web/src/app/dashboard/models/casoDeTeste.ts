import { Colaborador } from './colaborador';

export enum EPrioridade {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA',
}

export enum EComplexidade {
  COMPLEXO = 'COMPLEXO',
  MEDIO = 'MEDIO',
  SIMPLES = 'SIMPLES',
}

export enum EStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
}

export enum ECategoria {
  MANUAL = 'MANUAL',
  AUTOMATIZADO = 'AUTOMATIZADO',
}

export enum ETecnica {
  FUNCIONAL = 'FUNCIONAL',
  ESTRUTURAL = 'ESTRUTURAL',
}

export class CasoDeTeste {
  constructor(
    public nome: string,

    public descricao: string,

    public observacoes: string,

    public prioridade: 'ALTA' | 'MEDIA' | 'BAIXA',

    public preCondicao: string,

    public posCondicao: string,

    public complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO',

    public status: 'ATIVO' | 'INATIVO',

    public resultadoEsperado: string,

    public metodo: 'MANUAL' | 'AUTOMATIZADO',

    public tecnica: 'FUNCIONAL' | 'ESTRUTURAL',

    public dadosEntrada: string,

    public id?: number,

    public casoDeUsoId?: number,

    public suiteDeTesteId?: number,

    public testadorDesignadoId?: number,

    public testadorDesignado?: Colaborador
  ) {}
}
