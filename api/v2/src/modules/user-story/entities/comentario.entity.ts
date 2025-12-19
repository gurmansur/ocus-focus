import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UserStory } from './user-story.entity';

@Entity('COMENTARIOS')
export class Comentario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CMN_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'CMN_COMENTARIO' })
  comentario: string;

  @Column({ type: 'datetime', name: 'CMN_CRIADO_EM' })
  criado_em: Date;

  @Column({ type: 'datetime', name: 'CMN_MODIFICADO_EM' })
  modificado_em: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'FK_USUARIO_ID' })
  usuario: Usuario;

  @ManyToOne(() => UserStory, (userStory) => userStory.id)
  @JoinColumn({ name: 'FK_USER_STORY' })
  userStory: UserStory;
}
