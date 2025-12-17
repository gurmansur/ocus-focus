import { EXECUTION_TYPES, RESULT_TYPES } from '../execucao-de-teste.constants';

export class CreateExecucaoDeTesteBo {
  nome: string;

  casoDeTesteId: number;

  dataExecucao: Date;

  metodo?: EXECUTION_TYPES;

  resultado?: RESULT_TYPES;
}
