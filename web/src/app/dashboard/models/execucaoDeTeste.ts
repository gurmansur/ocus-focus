import { CasoDeTeste } from './casoDeTeste';
import { Colaborador } from './colaborador';

export class ExecucaoDeTeste {
  constructor(
    public id: number,
    public nome: string,
    public resultado: string,
    public observacao: string,
    public data: string,
    public hora: string,
    public dataExecucao: string,
    public colaborador: Colaborador,
    public casoDeTeste: CasoDeTeste
  ) {}
}
