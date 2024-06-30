import { CasoDeTeste } from './casoDeTeste';
import { Colaborador } from './colaborador';

export class ExecucaoTeste {
  constructor(
    public id: number,
    public nome: string,
    public status: string,
    public data: string,
    public hora: string,
    public colaborador: Colaborador,
    public casoDeTeste: CasoDeTeste
  ) {}
}
