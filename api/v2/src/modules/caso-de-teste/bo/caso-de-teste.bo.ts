import { CasoUsoBo } from 'src/modules/caso-uso/dto copy/caso-uso.bo';
import { ColaboradorBo } from 'src/modules/colaborador/bo/colaborador.bo';
import { SuiteDeTesteBo } from 'src/modules/suite-de-teste/bo/suite-de-teste.bo';

export class CasoDeTesteBo {
  id: number;

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

  casoDeUso: CasoUsoBo;

  suiteDeTeste?: SuiteDeTesteBo;

  testadorDesignado?: ColaboradorBo;
}
