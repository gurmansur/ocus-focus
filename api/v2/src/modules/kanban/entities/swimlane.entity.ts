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

  @Column({ type: 'varchar', name: 'SWI_COR', length: 7, default: '#6d28d9' })
  cor: string;

  @Column({ type: 'varchar', name: 'SWI_ICONE', length: 30, nullable: true })
  icone: string;

  @Column({ type: 'int', name: 'SWI_ORDEM', default: 0 })
  ordem: number;

  @CreateDateColumn({ name: 'SWI_CRIADO_EM' })
  criadoEm: Date;

  @CreateDateColumn({ name: 'SWI_ATUALIZADO_EM' })
  atualizadoEm: Date;

  @ManyToOne(() => Kanban, (kanban) => kanban.swimlanes)
  @JoinColumn({ name: 'FK_KAN_ID' })
  kanban: Kanban;

  @OneToMany(() => UserStory, (userStory) => userStory.swimlane)
  userStories: UserStory[];
}
