import { ApiProperty } from '@nestjs/swagger';
import { RodadaDeTesteStatus } from '../entities/rodada-de-teste.entity';
import { TestRunResultDto } from './test-run-result.dto';

export class RodadaDeTesteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty({
    enum: ['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ABORTADO'],
  })
  status: RodadaDeTesteStatus;

  @ApiProperty({ type: [String] })
  casosIds: string[];

  @ApiProperty({ type: [TestRunResultDto], required: false })
  resultados?: TestRunResultDto[];

  @ApiProperty({ required: false })
  ambiente?: string;

  @ApiProperty({ required: false })
  responsavel?: string;

  @ApiProperty({ required: false })
  dataInicio?: Date;

  @ApiProperty({ required: false })
  dataFim?: Date;

  @ApiProperty()
  dataCriacao: Date;

  @ApiProperty()
  dataAtualizacao: Date;
}
