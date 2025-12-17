export class ProjetoBo {
  nome: string;

  descricao: string;

  empresa: string;

  dataInicio: Date;

  previsaoFim: Date;

  status: 'EM ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';
}
