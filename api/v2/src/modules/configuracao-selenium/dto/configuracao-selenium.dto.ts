import { ApiProperty } from '@nestjs/swagger';

export class ConfiguracaoSeleniumDto {
  @ApiProperty({ description: 'ID da configuração' })
  id: number;

  @ApiProperty({ description: 'Nome da configuração' })
  nome: string;

  @ApiProperty({ description: 'Navegador' })
  navegador: string;

  @ApiProperty({ description: 'Modo headless' })
  headless: boolean;

  @ApiProperty({ description: 'Timeout padrão (ms)' })
  timeoutPadrao: number;

  @ApiProperty({ description: 'Timeout implícito (ms)' })
  timeoutImplicito: number;

  @ApiProperty({ description: 'Timeout de carregamento (ms)' })
  timeoutCarregamentoPagina: number;

  @ApiProperty({ description: 'Resolução da janela' })
  resolucao: string;

  @ApiProperty({ description: 'Maximizar janela' })
  maximizarJanela: boolean;

  @ApiProperty({ description: 'Aceitar certificados SSL' })
  aceitarCertificadosSSL: boolean;

  @ApiProperty({ description: 'Capturar screenshots' })
  capturarScreenshots: boolean;

  @ApiProperty({ description: 'Capturar logs' })
  capturarLogs: boolean;

  @ApiProperty({ description: 'URL Selenium Grid', required: false })
  urlSeleniumGrid?: string;

  @ApiProperty({ description: 'Opções adicionais', required: false })
  opcoesAdicionais?: Record<string, any>;

  @ApiProperty({ description: 'User Agent', required: false })
  userAgent?: string;

  @ApiProperty({ description: 'Proxy', required: false })
  proxy?: string;

  @ApiProperty({ description: 'Configuração ativa' })
  ativa: boolean;

  @ApiProperty({ description: 'ID do projeto' })
  projetoId: number;

  @ApiProperty({ description: 'Data de criação' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data de atualização' })
  dataAtualizacao: Date;
}
