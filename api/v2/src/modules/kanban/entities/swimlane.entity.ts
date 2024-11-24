import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { Kanban } from './kanban.entity';

@Entity('SWIMLANES')
export class Swimlane {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SWI_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'SWI_NOME', length: 30 })
  nome: string;

  @Column({ type: 'tinyint', width: 1, name: 'SWI_VERTICAL', default: 0 })
  vertical: boolean;

  @Column({ type: 'varchar', name: 'SWI_COR', length: 6 })
  cor: string;

  @CreateDateColumn({ name: 'SWI_CRIADO_EM' })
  criadoEm: Date;

  @CreateDateColumn({ name: 'SWI_ATUALIZADO_EM' })
  atualizadoEm: Date;

  @ManyToOne(() => Kanban, (kanban) => kanban.swinlanes)
  @JoinColumn({ name: 'FK_KAN_ID' })
  kanban: Kanban;

  @OneToMany(() => UserStory, (userStory) => userStory.swimlane)
  userStories: UserStory[];
}
