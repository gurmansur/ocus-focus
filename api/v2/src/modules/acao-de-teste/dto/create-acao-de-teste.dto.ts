import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAcaoDeTesteDto {
  @ApiProperty({ description: 'Ordem de execução da ação', example: 1 })
  @IsInt()
  @Min(1)
  ordem: number;

  @ApiProperty({
    description: 'Tipo da ação',
    enum: [
      'NAVEGAR',
      'CLICAR',
      'DIGITAR',
      'SELECIONAR',
      'ESPERAR',
      'VALIDAR_TEXTO',
      'VALIDAR_ELEMENTO',
      'SCREENSHOT',
      'EXECUTAR_SCRIPT',
      'SCROLL',
      'HOVER',
      'DUPLO_CLIQUE',
      'CLICAR_DIREITO',
      'LIMPAR_CAMPO',
      'PRESSIONAR_TECLA',
      'UPLOAD_ARQUIVO',
      'TROCAR_JANELA',
      'TROCAR_FRAME',
      'ACEITAR_ALERTA',
      'REJEITAR_ALERTA',
      'OBTER_TEXTO_ALERTA',
    ],
    example: 'CLICAR',
  })
  @IsEnum([
    'NAVEGAR',
    'CLICAR',
    'DIGITAR',
    'SELECIONAR',
    'ESPERAR',
    'VALIDAR_TEXTO',
    'VALIDAR_ELEMENTO',
    'SCREENSHOT',
    'EXECUTAR_SCRIPT',
    'SCROLL',
    'HOVER',
    'DUPLO_CLIQUE',
    'CLICAR_DIREITO',
    'LIMPAR_CAMPO',
    'PRESSIONAR_TECLA',
    'UPLOAD_ARQUIVO',
    'TROCAR_JANELA',
    'TROCAR_FRAME',
    'ACEITAR_ALERTA',
    'REJEITAR_ALERTA',
    'OBTER_TEXTO_ALERTA',
  ])
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({
    description: 'Seletor do elemento',
    example: '#submit-button',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  seletor?: string;

  @ApiProperty({
    description: 'Tipo do seletor',
    enum: ['ID', 'CLASS', 'CSS', 'XPATH', 'NAME', 'TAG', 'LINK_TEXT'],
    example: 'CSS',
    required: false,
  })
  @IsEnum(['ID', 'CLASS', 'CSS', 'XPATH', 'NAME', 'TAG', 'LINK_TEXT'])
  @IsOptional()
  tipoSeletor?: string;

  @ApiProperty({
    description: 'Valor para a ação (URL, texto, etc.)',
    example: 'https://example.com',
    required: false,
  })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  valor?: string;

  @ApiProperty({
    description: 'Timeout em milissegundos',
    example: 5000,
    default: 5000,
  })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeout?: number;

  @ApiProperty({
    description: 'Descrição da ação',
    example: 'Clicar no botão de login',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  descricao?: string;

  @ApiProperty({
    description: 'Se a ação é obrigatória',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  obrigatorio?: boolean;

  @ApiProperty({
    description: 'Mensagem de erro customizada',
    required: false,
  })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  mensagemErro?: string;

  @ApiProperty({ description: 'ID do caso de teste', example: 1 })
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  casoDeTesteId: number;
}
