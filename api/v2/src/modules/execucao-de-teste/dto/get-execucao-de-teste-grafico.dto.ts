import { ApiProperty } from '@nestjs/swagger';
import { RESULT_TYPES } from '../execucao-de-teste.constants';

export class GetExecucaoDeTesteGraficoDto {
  @ApiProperty({
    type: Number,
    description: 'Quantidade de execuções de teste com sucesso',
    example: 1,
  })
  [RESULT_TYPES.SUCCESS]: number;

  @ApiProperty({
    type: Number,
    description: 'Quantidade de execuções de teste com falha',
    example: 1,
  })
  [RESULT_TYPES.FAILURE]: number;

  @ApiProperty({
    type: Number,
    description: 'Quantidade de execuções de teste pendentes',
    example: 1,
  })
  [RESULT_TYPES.PENDING]: number;
}
