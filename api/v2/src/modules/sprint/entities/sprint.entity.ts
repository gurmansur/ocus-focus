import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
