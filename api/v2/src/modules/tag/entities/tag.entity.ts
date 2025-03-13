import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('TAGS')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tag_id' })
  id: number;

  @Column({ type: 'varchar', name: 'tag_nome', length: 20 })
  nome: string;

  @Column({ type: 'varchar', name: 'tag_cor', length: 7 })
  cor: string;

  @ManyToMany(() => UserStory)
  @JoinTable({
    name: 'USER_STORY_TAGS',
  })
  userStory: UserStory;
}
