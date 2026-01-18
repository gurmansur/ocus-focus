import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Assinatura } from './assinatura.entity';

@Entity('PLANOS')
export class Plano {
  @PrimaryGeneratedColumn({ name: 'PLA_ID' })
  id: number;

  @Column({ name: 'PLA_NOME', length: 50, unique: true })
  nome: string;

  @Column({ name: 'PLA_DESCRICAO', type: 'text' })
  descricao: string;

  @Column({
    name: 'PLA_PRECO_MENSAL',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  precoMensal: number;

  @Column({ name: 'PLA_PRECO_ANUAL', type: 'decimal', precision: 10, scale: 2 })
  precoAnual: number;

  @Column({ name: 'PLA_LIMITE_PROJETOS', type: 'int', nullable: true })
  limiteProjetos: number | null;

  @Column({ name: 'PLA_LIMITE_USUARIOS', type: 'int', nullable: true })
  limiteUsuarios: number | null;

  @Column({ name: 'PLA_FERRAMENTAS_DISPONIVEIS', type: 'simple-array' })
  ferramentasDisponiveis: string[];

  @Column({ name: 'PLA_CARACTERISTICAS', type: 'simple-json' })
  caracteristicas: Record<string, any>;

  @Column({ name: 'PLA_ATIVO', type: 'boolean', default: true })
  ativo: boolean;

  @OneToMany(() => Assinatura, (assinatura) => assinatura.plano)
  assinaturas: Assinatura[];

  @CreateDateColumn({ name: 'PLA_CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'PLA_UPDATED_AT' })
  updatedAt: Date;
}
