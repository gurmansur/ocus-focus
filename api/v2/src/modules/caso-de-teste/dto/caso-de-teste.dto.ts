import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CasoUsoDto } from 'src/modules/caso-uso/dto/caso-uso.dto';
import { ColaboradorDto } from 'src/modules/colaborador/dto/colaborador.dto';
import { SuiteDeTesteDto } from 'src/modules/suite-de-teste/dto/suite-de-teste.dto';

export class CasoDeTesteDto {
  @ApiProperty({
    type: 'number',
    description: 'Id do Caso de Teste',
    required: true,
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Nome do Caso de Teste',
    required: true,
    example: 'Caso de Teste 1',
  })
  nome: string;

  @ApiProperty({
    type: 'string',
    description: 'Descrição do Caso de Teste',
    required: true,
    example: 'Descrição do Caso de Teste 1',
  })
  descricao: string;

  @ApiProperty({
    type: 'string',
    description: 'Observação do Caso de Teste',
    required: false,
    example: 'Observação do Caso de Teste 1',
  })
  observacoes: string;

  @ApiProperty({
    type: 'enum',
    enum: ['ALTA', 'MEDIA', 'BAIXA'],
    description: 'Prioridade do Caso de Teste',
    required: true,
    example: 'ALTA',
  })
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';

  @ApiProperty({
    type: 'string',
    description: 'Pré condição do Caso de Teste',
    required: false,
    example: 'Pré condição do Caso de Teste 1',
  })
  preCondicao: string;

  @ApiProperty({
    type: 'string',
    description: 'Pós condição do Caso de Teste',
    required: false,
    example: 'Pós condição do Caso de Teste 1',
  })
  posCondicao: string;

  @ApiProperty({
    type: 'enum',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    description: 'Complexidade do Caso de Teste',
    required: true,
    example: 'SIMPLES',
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @ApiProperty({
    type: 'enum',
    enum: ['ATIVO', 'INATIVO'],
    description: 'Status do Caso de Teste',
    required: true,
    example: 'ATIVO',
  })
  status: 'ATIVO' | 'INATIVO';

  @ApiProperty({
    type: 'string',
    description: 'Resultado esperado do Caso de Teste',
    required: true,
    example: 'Resultado esperado do Caso de Teste 1',
  })
  resultadoEsperado: string;

  @ApiProperty({
    type: 'enum',
    enum: ['MANUAL', 'AUTOMATIZADO'],
    description: 'Método do Caso de Teste',
    required: true,
    example: 'MANUAL',
  })
  metodo: 'MANUAL' | 'AUTOMATIZADO';

  @ApiProperty({
    type: 'enum',
    enum: ['FUNCIONAL', 'ESTRUTURAL'],
    description: 'Técnica do Caso de Teste',
    required: true,
    example: 'FUNCIONAL',
  })
  tecnica: 'FUNCIONAL' | 'ESTRUTURAL';

  @ApiProperty({
    type: 'string',
    description: 'Dados de entrada do Caso de Teste',
    required: false,
    example: 'Dados de entrada do Caso de Teste 1',
  })
  dadosEntrada: string;

  @ApiProperty({
    type: CasoUsoDto,
    description: 'Caso de Uso do Caso de Teste',
    required: true,
  })
  @Type(() => CasoUsoDto)
  casoDeUso: CasoUsoDto;

  @ApiProperty({
    type: () => SuiteDeTesteDto,
    description: 'Suite de Teste do Caso de Teste',
    required: false,
  })
  @Type(() => SuiteDeTesteDto)
  suiteDeTeste?: SuiteDeTesteDto;

  @ApiProperty({
    type: ColaboradorDto,
    description: 'Testador Designado do Caso de Teste',
    required: false,
  })
  @Type(() => ColaboradorDto)
  testadorDesignado?: ColaboradorDto;
}
