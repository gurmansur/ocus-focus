import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { CasoDeTesteDto } from '../../caso-de-teste/dto/caso-de-teste.dto';

export class ExecucaoDeTesteDto {
  @ApiProperty({
    type: Number,
    description: 'ID da execução de teste',
    example: 1,
  })
  @Transform(({ value }) => parseInt(value))
  id: number;

  @ApiProperty({
    type: String,
    description: 'Resposta da execução de teste',
    example: 'Resposta 1',
  })
  resposta: string;

  @ApiProperty({
    type: 'enum',
    enum: ['MANUAL', 'AUTOMATIZADO'],
    description: 'Método de execução de teste',
    example: 'MANUAL',
  })
  metodo: 'MANUAL' | 'AUTOMATIZADO';

  @ApiProperty({
    type: String,
    description: 'Nome da execução de teste',
    example: 'Execução de teste 1',
  })
  nome: string;

  @ApiProperty({
    type: 'enum',
    enum: ['SUCESSO', 'FALHA', 'PENDENTE'],
    description: 'Resultado da execução de teste',
    example: 'SUCESSO',
  })
  resultado: 'SUCESSO' | 'FALHA' | 'PENDENTE';

  @ApiProperty({
    type: String,
    description: 'Observação sobre a execução de teste',
    example: 'Execução de teste realizada com sucesso',
  })
  observacao: string;

  @ApiProperty({
    type: CasoDeTesteDto,
    description: 'Caso de teste relacionado',
  })
  @Type(() => CasoDeTesteDto)
  casoDeTeste: CasoDeTesteDto;

  @ApiProperty({
    type: Date,
    description: 'Data de execução da execução de teste',
    example: '2021-10-01T00:00:00.000Z',
  })
  @Transform(({ value }) => new Date(value))
  dataExecucao: Date;
}
