export class UpdateConfiguracaoSeleniumBo {
  nome?: string;
  navegador?: string;
  headless?: boolean;
  timeoutPadrao?: number;
  timeoutImplicito?: number;
  timeoutCarregamentoPagina?: number;
  resolucao?: string;
  maximizarJanela?: boolean;
  aceitarCertificadosSSL?: boolean;
  capturarScreenshots?: boolean;
  capturarLogs?: boolean;
  urlSeleniumGrid?: string;
  opcoesAdicionais?: Record<string, any>;
  userAgent?: string;
  proxy?: string;
  ativa?: boolean;
}
