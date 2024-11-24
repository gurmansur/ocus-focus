import { CasoUsoBo } from '../../caso-uso/dto copy/caso-uso.bo';
import { ColaboradorBo } from '../../colaborador/bo/colaborador.bo';
import { ProjetoBo } from '../../projeto/bo/projeto.bo';
import { SuiteDeTesteBo } from '../../suite-de-teste/bo/suite-de-teste.bo';

export class CasoDeTesteBo {
  id: number;

  nome: string;

  descricao: string;

  observacoes: string;

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

  projeto: ProjetoBo;
}
