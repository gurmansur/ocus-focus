import { CasoDeTesteBo } from 'src/modules/caso-de-teste/bo/caso-de-teste.bo';

export class ExecucaoDeTesteBo {
  id: number;
  resposta: string;
  metodo: 'MANUAL' | 'AUTOMATIZADO';
  nome: string;
  resultado: 'SUCESSO' | 'FALHA' | 'PENDENTE';
  observacao: string;
  casoDeTeste: CasoDeTesteBo;
  dataExecucao: Date;
}
