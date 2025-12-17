import { CasoDeTesteBo } from '../../caso-de-teste/bo/caso-de-teste.bo';
import { EXECUTION_TYPES, RESULT_TYPES } from '../execucao-de-teste.constants';

export class ExecucaoDeTesteBo {
  id: number;
  resposta: string;
  metodo: EXECUTION_TYPES;
  nome: string;
  resultado: RESULT_TYPES;
  observacao: string;
  casoDeTeste: CasoDeTesteBo;
  dataExecucao: Date;
}
