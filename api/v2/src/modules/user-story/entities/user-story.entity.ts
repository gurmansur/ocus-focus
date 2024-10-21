import { Arquivo } from 'src/modules/arquivo/entities/arquivo.entity';
import { Kanban } from 'src/modules/kanban/entities/kanban.entity';
import { Swimlane } from 'src/modules/kanban/entities/swimlane.entity';
import { Sprint } from 'src/modules/sprint/entities/sprint.entity';
import { Subtarefa } from 'src/modules/subtarefa/entities/subtarefa.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comentario } from './comentario.entity';

@Entity('USER_STORIES')
export class UserStory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'UST_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'UST_NOME', length: 50 })
  nome: string;

  @Column({ type: 'varchar', name: 'UST_DESCRICAO' })
  descricao: string;

  @Column({ type: 'int', name: 'UST_ESTIMATIVA_TEMPO' })
  estimativa_tempo: number;

  @OneToMany(() => Comentario, (comentario) => comentario.id)
  comentarios: Comentario[];

  @ManyToMany(() => Tag)
  @JoinColumn({
    name: 'FK_TAG_ID',
  })
  tags: Tag[];

  @OneToMany(() => Subtarefa, (subtarefa) => subtarefa.userStory)
  subtarefas: Subtarefa[];

  @ManyToMany(() => Arquivo, (arquivo) => arquivo.userStories)
  @JoinTable({
    name: 'USER_STORY_ARQUIVOS',
  })
  arquivos: Arquivo[];

  @ManyToOne(() => Usuario, (usuario) => usuario.criadorUS)
  @JoinColumn({ name: 'FK_USUARIOS_USU_ID' })
  criador: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.responsavelUS)
  @JoinColumn({ name: 'FK_USUARIOS_USU_ID' })
  responsavel: Usuario;

  @ManyToMany(() => Usuario, (usuario) => usuario.participantesUS)
  @JoinTable({
    name: 'USER_STORIES_USUARIOS',
  })
  participantes: Usuario[];

  @ManyToOne(() => Kanban, (kanban) => kanban.userStories)
  @JoinColumn({ name: 'FK_KANBAN_ID' })
  kanban: Kanban;

  @ManyToMany(() => Sprint, (sprint) => sprint.userStories)
  @JoinTable({ name: 'SPRINTS_USERS_STORIES' })
  sprints: Sprint[];

  @ManyToOne(() => Swimlane, (swimlane) => swimlane.id)
  @JoinColumn({
    name: 'FK_SWI_ID',
  })
  swimlane: Swimlane;

  @Column({ type: 'timestamp', name: 'UST_CRIADO_EM' })
  criado_em: Date;

  @Column({ type: 'timestamp', name: 'UST_MODIFICADO_EM' })
  modificado_em: Date;
}
