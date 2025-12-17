export type TipoAcao =
  | 'NAVEGAR'
  | 'CLICAR'
  | 'DIGITAR'
  | 'SELECIONAR'
  | 'ESPERAR'
  | 'VALIDAR_TEXTO'
  | 'VALIDAR_ELEMENTO'
  | 'SCREENSHOT'
  | 'EXECUTAR_SCRIPT'
  | 'SCROLL'
  | 'HOVER'
  | 'DUPLO_CLIQUE'
  | 'CLICAR_DIREITO'
  | 'LIMPAR_CAMPO'
  | 'PRESSIONAR_TECLA'
  | 'UPLOAD_ARQUIVO'
  | 'TROCAR_JANELA'
  | 'TROCAR_FRAME'
  | 'ACEITAR_ALERTA'
  | 'REJEITAR_ALERTA'
  | 'OBTER_TEXTO_ALERTA';

export type TipoSeletor =
  | 'ID'
  | 'CLASS'
  | 'CSS'
  | 'XPATH'
  | 'NAME'
  | 'TAG'
  | 'LINK_TEXT';

export interface NodeDeTeste {
  id: string;
  ordem: number;
  tipo: TipoAcao;
  posicao: { x: number; y: number };
  dados: {
    seletor?: string;
    tipoSeletor?: TipoSeletor;
    valor?: string;
    timeout?: number;
    descricao?: string;
    obrigatorio?: boolean;
    mensagemErro?: string;
  };
}

export interface ConexaoNode {
  origem: string;
  destino: string;
}

export interface FluxoDeTeste {
  casoDeTesteId: number;
  nodes: NodeDeTeste[];
  conexoes: ConexaoNode[];
}

export interface AcaoDeTesteDto {
  id: number;
  ordem: number;
  tipo: TipoAcao;
  seletor?: string;
  tipoSeletor?: TipoSeletor;
  valor?: string;
  timeout: number;
  descricao?: string;
  obrigatorio: boolean;
  mensagemErro?: string;
  casoDeTesteId: number;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface CreateAcaoDeTesteDto {
  ordem: number;
  tipo: TipoAcao;
  seletor?: string;
  tipoSeletor?: TipoSeletor;
  valor?: string;
  timeout?: number;
  descricao?: string;
  obrigatorio?: boolean;
  mensagemErro?: string;
  casoDeTesteId: number;
}

export interface UpdateAcaoDeTesteDto {
  ordem?: number;
  tipo?: TipoAcao;
  seletor?: string;
  tipoSeletor?: TipoSeletor;
  valor?: string;
  timeout?: number;
  descricao?: string;
  obrigatorio?: boolean;
  mensagemErro?: string;
}

export interface ResultadoExecucao {
  execucaoId: number;
  sucesso: boolean;
  mensagem: string;
  logs: string[];
  screenshots: string[];
  tempoExecucao: number;
  erros: Array<{ acao: string; mensagem: string; timestamp: string }>;
}
