import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateConfiguracaoSeleniumDto {
  @ApiProperty({
    description: 'Nome da configuração',
    example: 'Configuração Padrão',
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Navegador a ser utilizado',
    enum: ['CHROME', 'FIREFOX', 'EDGE', 'SAFARI'],
    example: 'CHROME',
  })
  @IsEnum(['CHROME', 'FIREFOX', 'EDGE', 'SAFARI'])
  @IsNotEmpty()
  navegador: string;

  @ApiProperty({
    description: 'Executar em modo headless (sem interface gráfica)',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  headless?: boolean;

  @ApiProperty({
    description: 'Timeout padrão em milissegundos',
    example: 30000,
    default: 30000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeoutPadrao?: number;

  @ApiProperty({
    description: 'Timeout implícito em milissegundos',
    example: 10000,
    default: 10000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeoutImplicito?: number;

  @ApiProperty({
    description: 'Timeout de carregamento de página em milissegundos',
    example: 60000,
    default: 60000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeoutCarregamentoPagina?: number;

  @ApiProperty({
    description: 'Resolução da janela do navegador',
    example: '1920x1080',
    default: '1920x1080',
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  resolucao?: string;

  @ApiProperty({
    description: 'Maximizar janela ao iniciar',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  maximizarJanela?: boolean;

  @ApiProperty({
    description: 'Aceitar certificados SSL inválidos',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  aceitarCertificadosSSL?: boolean;

  @ApiProperty({
    description: 'Capturar screenshots durante a execução',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  capturarScreenshots?: boolean;

  @ApiProperty({
    description: 'Capturar logs do navegador',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  capturarLogs?: boolean;

  @ApiProperty({
    description: 'URL do Selenium Grid (se aplicável)',
    example: 'http://localhost:4444/wd/hub',
    required: false,
  })
  @ValidateIf((o) => o.urlSeleniumGrid !== null && o.urlSeleniumGrid !== '')
  @IsUrl({
    protocols: ['http', 'https'],
    require_protocol: true,
  })
  @Matches(/^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.(com|net|org|io|gov|edu))(:(0|[1-9]\d{0,4}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5]))?(\/.*)?$/, {
    message: 'urlSeleniumGrid must be a valid URL with allowed domain (localhost, private IPs, or public domains) and valid port (0-65535)',
  })
  @IsOptional()
  urlSeleniumGrid?: string;

  @ApiProperty({
    description: 'Opções adicionais do navegador (JSON)',
    required: false,
  })
  @IsObject()
  @IsOptional()
  opcoesAdicionais?: Record<string, any>;

  @ApiProperty({
    description: 'User Agent customizado',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  userAgent?: string;

  @ApiProperty({
    description: 'Configuração de proxy',
    example: 'http://proxy.example.com:8080',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  proxy?: string;

  @ApiProperty({
    description: 'Se a configuração está ativa',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  ativa?: boolean;

  @ApiProperty({
    description: 'ID do projeto',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  projetoId: number;
}
