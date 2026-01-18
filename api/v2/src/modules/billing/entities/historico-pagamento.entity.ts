import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Assinatura } from './assinatura.entity';

export enum StatusPagamento {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
  CANCELADO = 'CANCELADO',
  REEMBOLSADO = 'REEMBOLSADO',
}

export enum MetodoPagamento {
  CARTAO_CREDITO = 'CARTAO_CREDITO',
  BOLETO = 'BOLETO',
  PIX = 'PIX',
  PAYPAL = 'PAYPAL',
}

@Entity('HISTORICO_PAGAMENTOS')
export class HistoricoPagamento {
  @PrimaryGeneratedColumn({ name: 'HPA_ID' })
  id: number;

  @ManyToOne(() => Assinatura, (assinatura) => assinatura.historicosPagamento, {
    nullable: false,
  })
  @JoinColumn({ name: 'FK_ASSINATURAS_ASS_ID' })
  assinatura: Assinatura;

  @Column({ name: 'HPA_VALOR', type: 'decimal', precision: 10, scale: 2 })
  valor: number;

  @Column({
    name: 'HPA_STATUS',
    type: 'enum',
    enum: StatusPagamento,
    default: StatusPagamento.PENDENTE,
  })
  status: StatusPagamento;

  @Column({
    name: 'HPA_METODO',
    type: 'enum',
    enum: MetodoPagamento,
  })
  metodo: MetodoPagamento;

  @Column({ name: 'HPA_DATA_PAGAMENTO', type: 'datetime' })
  dataPagamento: Date;

  @Column({ name: 'HPA_DATA_VENCIMENTO', type: 'datetime' })
  dataVencimento: Date;

  @Column({ name: 'HPA_TRANSACAO_ID', length: 255, nullable: true })
  transacaoId: string | null;

  @Column({ name: 'HPA_OBSERVACOES', type: 'text', nullable: true })
  observacoes: string | null;

  @CreateDateColumn({ name: 'HPA_CREATED_AT' })
  createdAt: Date;
}
