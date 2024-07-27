import { Ator } from 'src/modules/ator/entities/ator.entity';
import { CasoUso } from 'src/modules/caso-uso/entities/caso-uso.entity';
import { Estimativa } from 'src/modules/estimativa/entities/estimativa.entity';
import { Requisito } from 'src/modules/requisito/entities/requisito.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('projetos')
export class Projeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'PRO_ID' })
  id: number;

  @Column('varchar', { name: 'PRO_NOME', length: 100 })
  nome: string;

  @Column('varchar', { name: 'PRO_DESCRICAO', length: 255 })
  descricao: string;

  @Column('varchar', { name: 'PRO_EMPRESA', length: 50 })
  empresa: string;

  @Column('date', { name: 'PRO_DATA_INICIO' })
  dataInicio: Date;

  @Column('date', { name: 'PRO_PREVISAO_FIM' })
  previsaoFim: Date;

  @Column('enum', {
    name: 'PRO_STATUS',
    enum: ['EM ANDAMENTO', 'CONCLUIDO', 'CANCELADO'],
    default: () => "'EM ANDAMENTO'",
  })
  status: 'EM ANDAMENTO' | 'CONCLUIDO' | 'CANCELADO';

  @Column('double', { name: 'PRO_RESTFACTOR', precision: 4, scale: 2 })
  restFactor: number;

  @Column('double', { name: 'PRO_RESEFACTOR', precision: 4, scale: 2 })
  reseFactor: number;

  @OneToMany(() => Ator, (ator) => ator.projeto)
  atores: Ator[];

  @OneToMany(() => CasoUso, (casoUso) => casoUso.projeto)
  casosDeUso: CasoUso[];

  @OneToMany(() => Requisito, (requisito) => requisito.projeto)
  requisitos: Requisito[];

  @OneToMany(() => Estimativa, (estimativa) => estimativa.projeto)
  estimativas: Estimativa[];
}
