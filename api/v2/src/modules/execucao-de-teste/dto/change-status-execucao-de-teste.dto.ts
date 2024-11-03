import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, ValidateIf } from 'class-validator';

export class ChangeStatusExecucaoDeTesteDto {
  @ApiProperty({
    type: 'enum',
    enum: ['SUCESSO', 'FALHA', 'PENDENTE'],
    description: 'Resultado da execução de teste',
    example: 'SUCESSO',
  })
  @IsEnum(['SUCESSO', 'FALHA', 'PENDENTE'])
  resultado: 'SUCESSO' | 'FALHA' | 'PENDENTE';

  @ApiProperty({
    type: String,
    description: 'Observação sobre a execução de teste',
    example: 'Execução de teste realizada com sucesso',
  })
  @ValidateIf((object) => object.resultado === 'FALHA')
  @IsString()
  observacao: string;
}
