import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('ESTIMATIVAS_ESFORCOS')
export class Estimativa {
  @PrimaryGeneratedColumn({ type: 'int', name: 'EST_ID' })
  id: number;

  @Column('varchar', { name: 'EST_NOME', length: 255 })
  name: string;

  @Column('text', { name: 'EST_DESCRICAO', nullable: true })
  description: string;

  // JSON columns to store complex data structures
  @Column('json', { name: 'EST_USE_CASE_WEIGHTS' })
  useCaseWeights: string | any; // MySQL JSON columns auto-deserialize to objects

  @Column('json', { name: 'EST_ACTOR_WEIGHTS' })
  actorWeights: string | any; // MySQL JSON columns auto-deserialize to objects

  @Column('json', { name: 'EST_TECHNICAL_FACTORS' })
  technicalFactors: string | any; // MySQL JSON columns auto-deserialize to objects

  @Column('json', { name: 'EST_ENVIRONMENTAL_FACTORS' })
  environmentalFactors: string | any; // MySQL JSON columns auto-deserialize to objects

  // Calculated UCP values
  @Column('double', { name: 'EST_UUCW', precision: 8, scale: 2, default: 0 })
  uucw: number; // Unadjusted Use Case Weight

  @Column('double', { name: 'EST_UAW', precision: 8, scale: 2, default: 0 })
  uaw: number; // Unadjusted Actor Weight

  @Column('double', { name: 'EST_UUCP', precision: 8, scale: 2, default: 0 })
  uucp: number; // Unadjusted Use Case Points

  @Column('double', { name: 'EST_TFACTOR', precision: 6, scale: 3, default: 0 })
  tfactor: number; // Technical Factor

  @Column('double', { name: 'EST_TCF', precision: 6, scale: 3, default: 0.6 })
  tcf: number; // Technical Complexity Factor

  @Column('double', { name: 'EST_EFACTOR', precision: 6, scale: 3, default: 0 })
  efactor: number; // Environmental Factor

  @Column('double', { name: 'EST_EF', precision: 6, scale: 3, default: 1.4 })
  ef: number; // Environmental Factor

  @Column('double', { name: 'EST_UCP', precision: 8, scale: 2, default: 0 })
  ucp: number; // Use Case Points

  @Column('double', {
    name: 'EST_HOURS_PER_UCP',
    precision: 6,
    scale: 2,
    default: 20,
  })
  hoursPerUCP: number;

  @Column('double', {
    name: 'EST_ESTIMATED_HOURS',
    precision: 8,
    scale: 2,
    default: 0,
  })
  estimatedHours: number;

  @Column('double', {
    name: 'EST_ESTIMATED_DAYS',
    precision: 8,
    scale: 2,
    default: 0,
  })
  estimatedDays: number;

  @Column('enum', {
    name: 'EST_STATUS',
    enum: ['draft', 'in-progress', 'completed'],
    default: 'draft',
  })
  status: 'draft' | 'in-progress' | 'completed';

  @CreateDateColumn({ name: 'EST_CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'EST_UPDATED_AT' })
  updatedAt: Date;

  @ManyToOne(() => Projeto, (projeto) => projeto.estimativas)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'FK_USUARIOS_USU_ID' })
  createdBy: Usuario;

  // Legacy columns kept for backward compatibility
  @Column('double', {
    name: 'EST_RESULTADO_HORAS',
    precision: 8,
    scale: 2,
    nullable: true,
  })
  resultadoHoras: number;

  @Column('int', { name: 'EST_PESO_ATORES', nullable: true })
  pesoAtores: number;

  @Column('int', { name: 'EST_PESO_CASOS_USO', nullable: true })
  pesoCasosUso: number;

  @Column('int', { name: 'EST_PESO_PONTOS_CASOS_USO', nullable: true })
  pesoPontosCasosUso: number;

  @Column('double', {
    name: 'EST_RESULTADO_PONTOS_CASOS_USO',
    precision: 6,
    scale: 3,
    nullable: true,
  })
  resultadoPontosCasosUso: number;

  @Column('varchar', {
    name: 'EST_DATA_ESTIMATIVA',
    length: 20,
    nullable: true,
  })
  dataEstimativa: string;

  // Legacy tFactor and eFactor columns (keep for backward compatibility, but use new ones)
  @Column('double', {
    name: 'EST_TFACTOR_LEGACY',
    precision: 6,
    scale: 3,
    nullable: true,
  })
  tFactor: number;

  @Column('double', {
    name: 'EST_EFACTOR_LEGACY',
    precision: 6,
    scale: 3,
    nullable: true,
  })
  eFactor: number;
}
