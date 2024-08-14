import { FatorTecnico } from 'src/modules/fatores-tecnicos/entities/fatores-tecnicos.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('FATORES_TECNICOS_PROJETOS')
export class FatorTecnicoProjeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'TEP_ID' })
  id: number;

  @Column('int', { name: 'TEP_VALOR' })
  valor: number;

  @ManyToOne(() => Projeto, (projeto) => projeto.fatoresTecnicos)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;

  @ManyToOne(() => FatorTecnico, (fatorTecnico) => fatorTecnico.projetos)
  @JoinColumn({ name: 'FK_FATORES_TECNICOS_TEC_ID' })
  fatorTecnico: FatorTecnico;
}
