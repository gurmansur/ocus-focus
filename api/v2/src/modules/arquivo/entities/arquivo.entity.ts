import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ARQUIVOS')
export class Arquivo {
  @PrimaryGeneratedColumn({ type: 'int', name: 'arq_id' })
  id: number;

  @Column({ type: 'mediumblob', name: 'arq_arquivo' })
  arquivo: string;

  @ManyToMany(() => UserStory, (userStory) => userStory.arquivos)
  userStories: UserStory[];
}
