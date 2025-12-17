import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FatorAmbiental } from '../../fatores-ambientais/entities/fatores-ambientais.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';

@Entity('FATORES_AMBIENTAIS_PROJETOS')
export class FatorAmbientalProjeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'AMP_ID' })
  id: number;

  @Column('int', { name: 'AMP_VALOR' })
  valor: number;

  @ManyToOne(() => Projeto, (projeto) => projeto.fatoresAmbientais)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;

  @ManyToOne(() => FatorAmbiental, (fatorAmbiental) => fatorAmbiental.projetos)
  @JoinColumn({ name: 'FK_FATORES_AMBIENTAIS_AMB_ID' })
  fatorAmbiental: FatorAmbiental;
}
