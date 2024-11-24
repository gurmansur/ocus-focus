import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('SUBTAREFAS')
export class Subtarefa {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SBT_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'SBT_DESCRICAO' })
  descricao: string;

  @Column({ type: 'tinyint', width: 1, name: 'SBT_COMPLETADA' })
  completada: boolean;

  @ManyToOne(() => UserStory, (userStory) => userStory.subtarefas)
  @JoinColumn({ name: 'FK_USER_STORY' })
  userStory: UserStory;
}
