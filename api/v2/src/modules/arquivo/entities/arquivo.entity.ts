import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('ARQUIVOS')
export class Arquivo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'arq_id' })
  id: number;

  @Column({ type: 'mediumblob', name: 'arq_arquivo' })
  arquivo: string;

  @ManyToMany(() => UserStory, (userStory) => userStory.arquivos)
  userStories: UserStory[];
}
