import { ApiProperty } from '@nestjs/swagger';
import { PlanoDeTesteStatus } from '../entities/plano-de-teste.entity';

export class PlanoDeTesteDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty({ enum: ['RASCUNHO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO'] })
  status: PlanoDeTesteStatus;

  @ApiProperty({ required: false })
  ambiente?: string;

  @ApiProperty({ required: false })
  dataAlvo?: Date;

  @ApiProperty({ required: false })
  dataInicio?: Date;

  @ApiProperty({ type: [Number] })
  suitesIds: number[];

  @ApiProperty({ type: [String], required: false })
  responsaveis?: string[];

  @ApiProperty()
  dataCriacao: Date;

  @ApiProperty()
  dataAtualizacao: Date;
}
