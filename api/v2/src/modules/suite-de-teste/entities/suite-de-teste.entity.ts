import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { CasoDeTeste } from '../../caso-de-teste/entities/caso-de-teste.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';

@Entity('SUITES_DE_TESTE')
@Tree('closure-table', {
  closureTableName: 'SUITES_DE_TESTE_RELATION',
})
export class SuiteDeTeste {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { name: 'SDT_NOME', length: 50 })
  nome: string;

  @Column('enum', {
    name: 'SDT_STATUS',
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO',
  })
  status: 'ATIVO' | 'INATIVO';

  @Column('varchar', { name: 'SDT_DESCRICAO', length: 255 })
  descricao: string;

  @Column('varchar', { name: 'SDT_OBSERVACOES', length: 255 })
  observacoes: string;

  @CreateDateColumn({ name: 'SDT_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'SDT_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'SDT_DATA_EXCLUSAO' })
  dataExclusao: Date;

  @OneToMany(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.suiteDeTeste, {
    eager: true,
  })
  casosDeTeste?: CasoDeTeste[];

  @TreeChildren()
  suitesFilhas?: SuiteDeTeste[];

  @TreeParent()
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  suitePai?: SuiteDeTeste;

  @ManyToOne(() => Projeto, (projeto) => projeto.suitesDeTeste)
  @JoinColumn({ name: 'FK_PROJETO_PRO_ID' })
  projeto: Projeto;
}
