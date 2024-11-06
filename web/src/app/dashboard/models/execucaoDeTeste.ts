import { CasoDeTeste } from './casoDeTeste';

export class ExecucaoDeTeste {
  constructor(
    public id: number,
    public nome: string,
    public resultado: string,
    public observacao: string,
    public data: string,
    public hora: string,
    public dataExecucao: string,
    public casoDeTeste: CasoDeTeste
  ) {}
}
