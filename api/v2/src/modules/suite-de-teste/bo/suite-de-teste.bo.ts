import { CasoDeTesteBo } from 'src/modules/caso-de-teste/bo/caso-de-teste.bo';

export class SuiteDeTesteBo {
  id: number;

  nome: string;

  status: 'ATIVO' | 'INATIVO';

  descricao: string;

  observacoes: string;

  suitePai: SuiteDeTesteBo;

  suitesFilhas: SuiteDeTesteBo[];

  casosDeTeste: CasoDeTesteBo[];
}
