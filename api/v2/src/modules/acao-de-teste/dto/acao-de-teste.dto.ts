import { ApiProperty } from '@nestjs/swagger';

export class AcaoDeTesteDto {
  @ApiProperty({ description: 'ID da ação', example: 1 })
  id: number;

  @ApiProperty({ description: 'Ordem de execução', example: 1 })
  ordem: number;

  @ApiProperty({ description: 'Tipo da ação', example: 'CLICAR' })
  tipo: string;

  @ApiProperty({
    description: 'Tipo de execução do passo',
    example: 'AUTOMATIZADO',
    enum: ['MANUAL', 'AUTOMATIZADO'],
  })
  execucaoTipo: 'MANUAL' | 'AUTOMATIZADO';

  @ApiProperty({ description: 'Seletor do elemento', required: false })
  seletor?: string;

  @ApiProperty({ description: 'Tipo do seletor', required: false })
  tipoSeletor?: string;

  @ApiProperty({ description: 'Valor da ação', required: false })
  valor?: string;

  @ApiProperty({ description: 'Timeout em ms', example: 5000 })
  timeout: number;

  @ApiProperty({ description: 'Descrição', required: false })
  descricao?: string;

  @ApiProperty({ description: 'É obrigatória', example: true })
  obrigatorio: boolean;

  @ApiProperty({ description: 'Mensagem de erro', required: false })
  mensagemErro?: string;

  @ApiProperty({
    description: 'Instrução detalhada para passo manual',
    required: false,
  })
  instrucaoManual?: string;

  @ApiProperty({
    description: 'Resultado esperado para passo manual',
    required: false,
  })
  resultadoManual?: string;

  @ApiProperty({ description: 'ID do caso de teste', example: 1 })
  casoDeTesteId: number;

  @ApiProperty({ description: 'Data de criação' })
  dataCriacao: Date;

  @ApiProperty({ description: 'Data de atualização' })
  dataAtualizacao: Date;
}
