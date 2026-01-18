import { Expose } from 'class-transformer';
import {
  MetodoPagamento,
  StatusPagamento,
} from '../entities/historico-pagamento.entity';

export class HistoricoPagamentoDto {
  @Expose()
  id: number;

  @Expose()
  valor: number;

  @Expose()
  status: StatusPagamento;

  @Expose()
  metodo: MetodoPagamento;

  @Expose()
  dataPagamento: Date;

  @Expose()
  dataVencimento: Date;

  @Expose()
  transacaoId: string | null;

  @Expose()
  observacoes: string | null;

  @Expose()
  createdAt: Date;
}
