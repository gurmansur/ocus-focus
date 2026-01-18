import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { SuiteDeTeste } from '../../suite-de-teste/entities/suite-de-teste.entity';

export type PlanoDeTesteStatus =
  | 'RASCUNHO'
  | 'ATIVO'
  | 'CONCLUIDO'
  | 'ARQUIVADO';

@Entity('PLANOS_DE_TESTE')
export class PlanoDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'PLT_ID' })
  id: number;

  @Column('varchar', { name: 'PLT_NOME', length: 100 })
  nome: string;

  @Column('varchar', { name: 'PLT_DESCRICAO', length: 500 })
  descricao: string;

  @Column('enum', {
    name: 'PLT_STATUS',
    enum: ['RASCUNHO', 'ATIVO', 'CONCLUIDO', 'ARQUIVADO'],
    default: 'RASCUNHO',
  })
  status: PlanoDeTesteStatus;

  @Column('datetime', { name: 'PLT_DATA_ALVO', nullable: true })
  dataAlvo?: Date;

  @Column('datetime', { name: 'PLT_DATA_INICIO', nullable: true })
  dataInicio?: Date;

  @Column('varchar', { name: 'PLT_AMBIENTE', length: 100, nullable: true })
  ambiente?: string;

  @Column('simple-array', { name: 'PLT_RESPONSAVEIS', nullable: true })
  responsaveis?: string[];

  @ManyToMany(() => SuiteDeTeste, { eager: true })
  @JoinTable({
    name: 'PLANOS_DE_TESTE_SUITES',
    joinColumn: {
      name: 'FK_PLANO_DE_TESTE_PLT_ID',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'FK_SUITE_DE_TESTE_SDT_ID',
      referencedColumnName: 'id',
    },
  })
  suites?: SuiteDeTeste[];

  @ManyToOne(() => Projeto, (projeto) => projeto.id, { nullable: false })
  projeto: Projeto;

  @CreateDateColumn({ name: 'PLT_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'PLT_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'PLT_DATA_EXCLUSAO' })
  dataExclusao?: Date;
}
