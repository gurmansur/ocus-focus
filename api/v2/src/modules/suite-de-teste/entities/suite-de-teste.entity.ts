import { CasoDeTeste } from 'src/modules/caso-de-teste/entities/caso-de-teste.entity';
import { PlanoDeTeste } from 'src/modules/plano-de-teste/entities/plano-de-teste.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @OneToMany(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.suiteDeTeste)
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  casosDeTeste: CasoDeTeste[];

  @ManyToOne(() => PlanoDeTeste, (planoDeTeste) => planoDeTeste.suitesDeTeste)
  @JoinColumn({ name: 'FK_PLANO_DE_TESTE_PDT_ID' })
  planoDeTeste: PlanoDeTeste;
}
