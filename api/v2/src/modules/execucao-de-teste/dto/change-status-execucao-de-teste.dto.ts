import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { resultTypes } from '../execucao-de-teste.constants';

export class ChangeStatusExecucaoDeTesteDto {
  @ApiProperty({
    type: 'enum',
    enum: resultTypes,
    description: 'Resultado da execução de teste',
    example: 'SUCESSO',
  })
  @IsEnum(resultTypes)
  resultado: resultTypes;

  @ApiProperty({
    type: String,
    description: 'Observação sobre a execução de teste',
    example: 'Execução de teste realizada com sucesso',
  })
  @ValidateIf((object) => object.resultado === 'FALHA')
  @IsString()
  observacao: string;
}
