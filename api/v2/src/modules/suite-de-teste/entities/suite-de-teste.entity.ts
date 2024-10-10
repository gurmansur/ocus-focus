import { CasoDeTeste } from 'src/modules/caso-de-teste/entities/caso-de-teste.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('SUITES_DE_TESTE')
export class SuiteDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SDT_ID' })
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

  @OneToMany(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.suiteDeTeste)
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  casosDeTeste?: CasoDeTeste[];

  @OneToMany(() => SuiteDeTeste, (suiteDeTeste) => suiteDeTeste.suitePai, {
    nullable: true,
  })
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  suitesFilhas?: SuiteDeTeste[];

  @ManyToOne(() => SuiteDeTeste, (suiteDeTeste) => suiteDeTeste.suitesFilhas, {
    nullable: true,
  })
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  suitePai?: SuiteDeTeste;
}
