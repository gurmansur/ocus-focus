import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Arquivo } from '../../arquivo/entities/arquivo.entity';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { Comentario } from '../../comentario/entities/comentario.entity';
import { Kanban } from '../../kanban/entities/kanban.entity';
import { Swimlane } from '../../kanban/entities/swimlane.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Sprint } from '../../sprint/entities/sprint.entity';
import { Subtarefa } from '../../subtarefa/entities/subtarefa.entity';
import { Tag } from '../../tag/entities/tag.entity';

@Entity('USER_STORIES')
export class UserStory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'UST_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'UST_TITULO', length: 50 })
  titulo: string;

  @Column({ type: 'varchar', name: 'UST_DESCRICAO' })
  descricao: string;

  @Column({ type: 'int', name: 'UST_ESTIMATIVA_TEMPO' })
  estimativa_tempo: number;

  @OneToMany(() => Comentario, (comentario) => comentario.id)
  comentarios: Comentario[] | null;

  @ManyToMany(() => Tag)
  @JoinColumn({
    name: 'FK_TAG_ID',
  })
  tags: Tag[] | null;

  @OneToMany(() => Subtarefa, (subtarefa) => subtarefa.userStory)
  subtarefas: Subtarefa[] | null;

  @ManyToMany(() => Arquivo, (arquivo) => arquivo.userStories)
  @JoinTable({
    name: 'USER_STORY_ARQUIVOS',
  })
  arquivos: Arquivo[] | null;

  @ManyToOne(() => Colaborador, (colaborador) => colaborador.criadorUS)
  @JoinColumn({ name: 'FK_COLABORADOR_COL_CRI_ID' })
  criador: Colaborador;

  @ManyToOne(() => Colaborador, (colaborador) => colaborador.responsavelUS)
  @JoinColumn({ name: 'FK_COLABORADOR_COL_RES_ID' })
  responsavel: Colaborador;

  @ManyToMany(() => Colaborador, (colaborador) => colaborador.participantesUS)
  @JoinTable({
    name: 'USER_STORIES_COLABORADORES',
  })
  participantes: Colaborador[] | null;

  @ManyToOne(() => Kanban, (kanban) => kanban.userStories)
  @JoinColumn({ name: 'FK_KANBAN_ID' })
  kanban: Kanban;

  @ManyToOne(() => Projeto, (projeto) => projeto)
  @JoinColumn({
    name: 'FK_PRO_ID',
  })
  projeto: Projeto;

  @ManyToMany(() => Sprint, (sprint) => sprint.userStories)
  @JoinTable({ name: 'SPRINTS_USERS_STORIES' })
  sprints: Sprint[] | null;

  @ManyToOne(() => Swimlane, (swimlane) => swimlane.id)
  @JoinColumn({
    name: 'FK_SWI_ID',
  })
  swimlane: Swimlane;

  @CreateDateColumn({
    name: 'UST_CRIADO_EM',
  })
  criado_em: Date;

  @CreateDateColumn({
    name: 'UST_MODIFICADO_EM',
  })
  modificado_em: Date;
}
