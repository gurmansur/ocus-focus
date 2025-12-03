import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';

@Entity('SPRINTS')
export class Sprint {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SPR_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'SPR_NOME', length: 30 })
  nome: string;

  @Column({ type: 'varchar', name: 'SPR_DESCRICAO' })
  descricao: string;

  @Column({ type: 'int', name: 'SPR_HORAS_PREVISTAS' })
  horas_previstas: number;

  @CreateDateColumn({ name: 'SPR_DATA_INICIO' })
  data_inicio: Date;

  @CreateDateColumn({ name: 'SPR_DATA_FIM' })
  data_fim: Date;

  @ManyToMany(() => UserStory, (userStory) => userStory.sprints)
  userStories: UserStory[] | null;
  
  @ManyToOne(() => Projeto)
  @JoinColumn({ name: 'FK_PROJETO_PRO_ID' })
  projeto: Projeto;
}
