import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';
import { RESULT_TYPES } from '../execucao-de-teste.constants';

export class ChangeStatusExecucaoDeTesteDto {
  @ApiProperty({
    type: 'enum',
    enum: RESULT_TYPES,
    description: 'Resultado da execução de teste',
    example: 'SUCESSO',
  })
  @IsEnum(RESULT_TYPES)
  resultado: RESULT_TYPES;

  @ApiProperty({
    type: String,
    description: 'Observação sobre a execução de teste',
    example: 'Execução de teste realizada com sucesso',
  })
  @ValidateIf((object) => object.resultado === 'FALHA')
  @IsString()
  observacao: string;
}
