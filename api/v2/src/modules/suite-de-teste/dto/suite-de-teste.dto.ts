import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { CasoDeTesteDto } from '../../caso-de-teste/dto/caso-de-teste.dto';

export class SuiteDeTesteDto {
  constructor(partial?: Partial<SuiteDeTesteDto>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }

  @ApiProperty({
    type: 'number',
    description: 'Id da suite de teste',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    description: 'Nome da suite de teste',
    example: 'Suite de teste 1',
  })
  nome: string;

  @ApiProperty({
    type: 'enum',
    description: 'Status da suite de teste',
    example: 'ATIVO',
    enum: ['ATIVO', 'INATIVO'],
  })
  status: 'ATIVO' | 'INATIVO';

  @ApiProperty({
    type: 'string',
    description: 'Descrição da suite de teste',
    example: 'Descrição da suite de teste 1',
  })
  descricao: string;

  @ApiProperty({
    type: 'string',
    description: 'Observações da suite de teste',
    example: 'Observações da suite de teste 1',
  })
  observacoes: string;

  @ApiPropertyOptional({
    type: () => SuiteDeTesteDto,
    description: 'Suite de teste pai',
  })
  @Type(() => SuiteDeTesteDto)
  @Exclude()
  suitePai: SuiteDeTesteDto;

  @ApiPropertyOptional({
    type: () => [SuiteDeTesteDto],
    description: 'Suites de teste filhas',
  })
  suitesFilhas: SuiteDeTesteDto[];

  @ApiPropertyOptional({
    type: [CasoDeTesteDto],
    description: 'Casos de teste',
  })
  @Type(() => CasoDeTesteDto)
  casosDeTeste: CasoDeTesteDto[];

  @ApiPropertyOptional({
    type: 'number',
    description: 'Id da suite de teste pai',
  })
  suitePaiId: number;

  @ApiPropertyOptional({
    type: 'number',
    description: 'Id do projeto',
  })
  projetoId: number;
}
