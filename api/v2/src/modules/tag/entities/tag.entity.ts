import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('TAGS')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'tag_id' })
  id: number;

  @Column({ type: 'varchar', name: 'tag_nome', length: 20 })
  nome: string;

  @Column({ type: 'varchar', name: 'tag_cor', length: 6 })
  cor: string;

  @ManyToMany(() => UserStory)
  userStory: UserStory;
}
