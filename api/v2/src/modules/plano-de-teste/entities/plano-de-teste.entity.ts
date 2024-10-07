import { SuiteDeTeste } from 'src/modules/suite-de-teste/entities/suite-de-teste.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PLANOS_DE_TESTE')
export class PlanoDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'PDT_ID' })
  id: number;

  @Column('varchar', { name: 'PDT_NOME', length: 50 })
  nome: string;

  @Column('enum', {
    name: 'PDT_STATUS',
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO',
  })
  status: 'ATIVO' | 'INATIVO';

  @Column('timestamp', { name: 'PDT_DATA_LIMITE' })
  dataLimite: Date;

  @Column('varchar', { name: 'PDT_DESCRICAO', length: 255 })
  descricao: string;

  @Column('varchar', { name: 'PDT_OBSERVACOES', length: 255, nullable: true })
  observacoes: string;

  @OneToMany(() => SuiteDeTeste, (suiteDeTeste) => suiteDeTeste.planoDeTeste)
  suitesDeTeste: SuiteDeTeste[];
}
