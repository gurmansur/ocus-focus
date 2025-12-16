import { RESULT_TYPES } from '../execucao-de-teste.constants';

export class GetExecucaoDeTesteGraficoBo {
  [RESULT_TYPES.SUCCESS]: number;
  [RESULT_TYPES.FAILURE]: number;
  [RESULT_TYPES.PENDING]: number;
}
