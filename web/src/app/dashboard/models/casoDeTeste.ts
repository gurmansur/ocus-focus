import { casoUso } from './casoUso';
import { Colaborador } from './colaborador';
import { SuiteDeTeste } from './suiteDeTeste';

export enum EPrioridade {
  ALTA = 'Alta',
  MEDIA = 'Média',
  BAIXA = 'Baixa',
}

export enum EComplexidade {
  ALTA = 'Alta',
  MEDIA = 'Média',
  BAIXA = 'Baixa',
}

export enum EStatus {
  ATIVO = 'ATIVO',
  INATIVO = 'Inativo',
}

export enum ECategoria {
  MANUAL = 'Manual',
  AUTOMATIZADO = 'Automatizado',
}

export enum ETecnica {
  FUNCIONAL = 'Funcional',
  ESTRUTURAL = 'Estrutural',
}

export class CasoDeTeste {
  constructor(
    public nome: string,
    public descricao: string,
    public prioridade: EPrioridade,
    public complexidade: EComplexidade,
    public status: EStatus,
    public tecnica: ETecnica,
    public categoria: ECategoria,
    public dataCriacao: string,
    public resultadoEsperado: string,
    public entrada: string,
    public casoDeUso: casoUso,
    public observacoes?: string,
    public preCondicoes?: string,
    public posCondicoes?: string,
    public suiteDeTeste?: SuiteDeTeste,
    public testador?: Colaborador,
    public id?: number
  ) {}
}
