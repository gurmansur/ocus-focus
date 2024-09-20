import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tag_id' })
  id: number;

  @Column({ type: 'string', name: 'tag_nome' })
  nome: string;

  @Column({ type: 'string', name: 'tag_cor' })
  cor: string;

  @ManyToMany(() => UserStory)
  user_story: UserStory;
}
