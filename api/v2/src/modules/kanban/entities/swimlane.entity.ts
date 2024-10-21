import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Kanban } from './kanban.entity';

@Entity('SWIMLANES')
export class Swimlane {
  @PrimaryGeneratedColumn({ type: 'int', name: 'SWI_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'SWI_NOME', length: 30 })
  nome: string;

  @Column({ type: 'tinyint', width: 1, name: 'SWI_VERTICAL' })
  vertical: boolean;

  @Column({ type: 'varchar', name: 'SWI_COR', length: 6 })
  cor: string;

  @Column({ type: 'timestamp', name: 'SWI_CRIADO_EM' })
  criadoEm: Date;

  @Column({ type: 'timestamp', name: 'SWI_ATUALIZADO_EM' })
  atualizadoEm: Date;

  @ManyToOne(() => Kanban, (kanban) => kanban.swinlanes)
  @JoinColumn({ name: 'FK_KAN_ID' })
  kanban: Kanban;

  @OneToMany(() => UserStory, (userStory) => userStory.swimlane)
  userStories: UserStory[];
}
