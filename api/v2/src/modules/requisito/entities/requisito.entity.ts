import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';

@Entity()
export class Requisito {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ type: 'text' })
  descricao: string;

  @Column({
    type: 'enum',
    enum: ['FUNCIONAL', 'NÃO-FUNCIONAL'],
    default: 'FUNCIONAL',
  })
  tipo: 'FUNCIONAL' | 'NÃO-FUNCIONAL';

  @Column({
    type: 'enum',
    enum: ['ALTA', 'MÉDIA', 'BAIXA'],
    default: 'MÉDIA',
  })
  prioridade: 'ALTA' | 'MÉDIA' | 'BAIXA';

  @Column({ default: 'APROVADO' })
  status: string;

  @ManyToOne(() => Projeto, (projeto) => projeto.requisitos)
  projeto: Projeto;

  @CreateDateColumn({ name: 'data_criacao' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'data_atualizacao' })
  dataAtualizacao: Date;
} 