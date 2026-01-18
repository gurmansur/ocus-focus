export class UpdateAcaoDeTesteBo {
  ordem?: number;
  tipo?: string;
  execucaoTipo?: 'MANUAL' | 'AUTOMATIZADO';
  seletor?: string;
  tipoSeletor?: string;
  valor?: string;
  timeout?: number;
  descricao?: string;
  obrigatorio?: boolean;
  mensagemErro?: string;
  instrucaoManual?: string;
  resultadoManual?: string;
}
