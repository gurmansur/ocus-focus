import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';

export type RodadaDeTesteStatus =
  | 'NAO_INICIADO'
  | 'EM_ANDAMENTO'
  | 'CONCLUIDO'
  | 'ABORTADO';

export interface EvidenciaPayload {
  id: string;
  name: string;
  type: 'image' | 'file';
  url: string;
  uploadedAt?: string;
}

export interface PassoResultadoPayload {
  stepId: string;
  status: 'passed' | 'failed' | 'blocked' | 'skipped';
  actualResult?: string;
  notes?: string;
  evidence?: EvidenciaPayload[];
}

export interface CasoResultadoPayload {
  testCaseId: string;
  status: 'passed' | 'failed' | 'blocked' | 'skipped';
  stepResults: PassoResultadoPayload[];
  notes?: string;
  executedAt?: string;
  duration?: number;
}

@Entity('RODADAS_DE_TESTE')
export class RodadaDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'RTD_ID' })
  id: number;

  @Column('varchar', { name: 'RTD_NOME', length: 120 })
  nome: string;

  @Column('enum', {
    name: 'RTD_STATUS',
    enum: ['NAO_INICIADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'ABORTADO'],
    default: 'NAO_INICIADO',
  })
  status: RodadaDeTesteStatus;

  @Column('simple-json', { name: 'RTD_CASOS' })
  casosIds: string[];

  @Column('json', { name: 'RTD_RESULTADOS', nullable: true })
  resultados?: CasoResultadoPayload[];

  @Column('varchar', { name: 'RTD_AMBIENTE', length: 100, nullable: true })
  ambiente?: string;

  @Column('varchar', { name: 'RTD_RESPONSAVEL', length: 100, nullable: true })
  responsavel?: string;

  @Column('datetime', { name: 'RTD_DATA_INICIO', nullable: true })
  dataInicio?: Date;

  @Column('datetime', { name: 'RTD_DATA_FIM', nullable: true })
  dataFim?: Date;

  @CreateDateColumn({ name: 'RTD_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'RTD_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'RTD_DATA_EXCLUSAO' })
  dataExclusao?: Date;

  @ManyToOne(() => Projeto, (projeto) => projeto.id, { nullable: false })
  projeto: Projeto;
}
