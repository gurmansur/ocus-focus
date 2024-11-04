import { ApiProperty } from '@nestjs/swagger';
import { resultTypes } from '../execucao-de-teste.constants';

export class GetExecucaoDeTesteGraficoDto {
  @ApiProperty({
    type: Number,
    description: 'Quantidade de execuções de teste com sucesso',
    example: 1,
  })
  [resultTypes.SUCCESS]: number;

  @ApiProperty({
    type: Number,
    description: 'Quantidade de execuções de teste com falha',
    example: 1,
  })
  [resultTypes.FAILURE]: number;

  @ApiProperty({
    type: Number,
    description: 'Quantidade de execuções de teste pendentes',
    example: 1,
  })
  [resultTypes.PENDING]: number;
}
