import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('ARQUIVOS')
export class Arquivo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ARQ_ID' })
  id: number;

  @Column({ type: 'mediumblob', name: 'ARQ_ARQUIVO' })
  arquivo: string;

  @ManyToMany(() => UserStory, (userStory) => userStory.arquivos)
  userStories: UserStory[];
}
