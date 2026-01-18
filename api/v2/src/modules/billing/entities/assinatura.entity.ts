import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { HistoricoPagamento } from './historico-pagamento.entity';
import { Plano } from './plano.entity';

export enum StatusAssinatura {
  ATIVA = 'ATIVA',
  CANCELADA = 'CANCELADA',
  SUSPENSA = 'SUSPENSA',
  EXPIRADA = 'EXPIRADA',
  TRIAL = 'TRIAL',
}

export enum TipoPeriodo {
  MENSAL = 'MENSAL',
  ANUAL = 'ANUAL',
}

@Entity('ASSINATURAS')
export class Assinatura {
  @PrimaryGeneratedColumn({ name: 'ASS_ID' })
  id: number;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'FK_USUARIOS_USU_ID' })
  usuario: Usuario;

  @ManyToOne(() => Plano, (plano) => plano.assinaturas, { nullable: false })
  @JoinColumn({ name: 'FK_PLANOS_PLA_ID' })
  plano: Plano;

  @ManyToOne(() => Projeto, { nullable: true })
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto | null;

  @Column({
    name: 'ASS_STATUS',
    type: 'enum',
    enum: StatusAssinatura,
    default: StatusAssinatura.ATIVA,
  })
  status: StatusAssinatura;

  @Column({
    name: 'ASS_TIPO_PERIODO',
    type: 'enum',
    enum: TipoPeriodo,
    default: TipoPeriodo.MENSAL,
  })
  tipoPeriodo: TipoPeriodo;

  @Column({ name: 'ASS_DATA_INICIO', type: 'datetime' })
  dataInicio: Date;

  @Column({ name: 'ASS_DATA_FIM', type: 'datetime', nullable: true })
  dataFim: Date | null;

  @Column({ name: 'ASS_PROXIMO_PAGAMENTO', type: 'datetime' })
  proximoPagamento: Date;

  @Column({ name: 'ASS_VALOR_ATUAL', type: 'decimal', precision: 10, scale: 2 })
  valorAtual: number;

  @Column({ name: 'ASS_AUTO_RENOVACAO', type: 'boolean', default: true })
  autoRenovacao: boolean;

  @Column({ name: 'ASS_TRIAL', type: 'boolean', default: false })
  trial: boolean;

  @Column({ name: 'ASS_DATA_FIM_TRIAL', type: 'datetime', nullable: true })
  dataFimTrial: Date | null;

  @OneToMany(() => HistoricoPagamento, (historico) => historico.assinatura)
  historicosPagamento: HistoricoPagamento[];

  @CreateDateColumn({ name: 'ASS_CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'ASS_UPDATED_AT' })
  updatedAt: Date;
}
