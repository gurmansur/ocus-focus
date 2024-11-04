import { resultTypes } from '../execucao-de-teste.constants';

export class GetExecucaoDeTesteGraficoBo {
  [resultTypes.SUCCESS]: number;
  [resultTypes.FAILURE]: number;
  [resultTypes.PENDING]: number;
}
