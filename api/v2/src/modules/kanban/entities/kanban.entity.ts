import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { Swimlane } from './swimlane.entity';

@Entity('KANBANS')
export class Kanban {
  @PrimaryGeneratedColumn({ type: 'int', name: 'KAN_ID' })
  id: number;

  @OneToMany(() => Swimlane, (swimlane) => swimlane.id)
  swinlanes: Swimlane[];

  @OneToMany(() => UserStory, (userStory) => userStory.id)
  userStories: UserStory[];

  @OneToOne(() => Projeto)
  @JoinColumn({
    name: 'FK_PRO_ID',
  })
  projeto: Projeto;
}
