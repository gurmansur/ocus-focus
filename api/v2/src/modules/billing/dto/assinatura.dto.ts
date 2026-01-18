import { Expose, Type } from 'class-transformer';
import { StatusAssinatura, TipoPeriodo } from '../entities/assinatura.entity';
import { PlanoDto } from './plano.dto';

export class AssinaturaDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => PlanoDto)
  plano: PlanoDto;

  @Expose()
  status: StatusAssinatura;

  @Expose()
  tipoPeriodo: TipoPeriodo;

  @Expose()
  dataInicio: Date;

  @Expose()
  dataFim: Date | null;

  @Expose()
  proximoPagamento: Date;

  @Expose()
  valorAtual: number;

  @Expose()
  autoRenovacao: boolean;

  @Expose()
  trial: boolean;

  @Expose()
  dataFimTrial: Date | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
