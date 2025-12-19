import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('TAGS')
export class Tag {
  @PrimaryGeneratedColumn({ type: 'int', name: 'TAG_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'TAG_NOME', length: 20 })
  nome: string;

  @Column({ type: 'varchar', name: 'TAG_COR', length: 6 })
  cor: string;

  @ManyToMany(() => UserStory)
  userStory: UserStory;
}
