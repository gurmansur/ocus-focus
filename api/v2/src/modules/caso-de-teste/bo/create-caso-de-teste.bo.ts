export class CreateCasoDeTesteBo {
  nome: string;

  descricao: string;

  observacao: string;

  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';

  preCondicao: string;

  posCondicao: string;

  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  status: 'ATIVO' | 'INATIVO';

  resultadoEsperado: string;

  metodo: 'MANUAL' | 'AUTOMATIZADO';

  tecnica: 'FUNCIONAL' | 'ESTRUTURAL';

  dadosEntrada: string;

  casoDeUsoId: number;

  suiteDeTesteId?: number;

  testadorDesignadoId?: number;
}
