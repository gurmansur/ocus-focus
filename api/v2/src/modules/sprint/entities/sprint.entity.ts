import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';

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

  @ManyToOne(() => Projeto, (projeto) => projeto.id, { eager: true })
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;

  @ManyToMany(() => UserStory, (userStory) => userStory.sprints)
  userStories: UserStory[] | null;
}
