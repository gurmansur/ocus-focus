import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import {
  Column,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class Arquivo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'arq_id' })
  id: number;

  @Column({ type: 'mediumblob', name: 'arq_arquivo' })
  arquivo: string;

  @ManyToMany(() => UserStory)
  @JoinColumn({
    name: 'fk_ust_id',
  })
  user_story: UserStory;
}
