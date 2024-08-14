import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ESTIMATIVAS_ESFORCOS')
export class Estimativa {
  @PrimaryGeneratedColumn({ type: 'int', name: 'EST_ID' })
  id: number;

  @Column('double', { name: 'EST_RESULTADO_HORAS', precision: 8, scale: 2 })
  resultadoHoras: number;

  @Column('int', { name: 'EST_PESO_ATORES' })
  pesoAtores: number;

  @Column('int', { name: 'EST_PESO_CASOS_USO' })
  pesoCasosUso: number;

  @Column('int', { name: 'EST_PESO_PONTOS_CASOS_USO' })
  pesoPontosCasosUso: number;

  @Column('double', { name: 'EST_TFACTOR', precision: 6, scale: 3 })
  tFactor: number;

  @Column('double', { name: 'EST_EFACTOR', precision: 6, scale: 3 })
  eFactor: number;

  @Column('double', {
    name: 'EST_RESULTADO_PONTOS_CASOS_USO',
    precision: 6,
    scale: 3,
  })
  resultadoPontosCasosUso: number;

  @Column('varchar', { name: 'EST_DATA_ESTIMATIVA', length: 20 })
  dataEstimativa: string;

  @ManyToOne(() => Projeto, (projeto) => projeto.estimativas)
  projeto: Projeto;
}
