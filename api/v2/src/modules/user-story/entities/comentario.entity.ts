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
  @PrimaryGeneratedColumn({ type: 'int', name: 'cmn_id' })
  id: number;

  @Column({ type: 'varchar', name: 'cmn_comentario' })
  comentario: string;

  @Column({ type: 'datetime', name: 'cmn_criado_em' })
  criado_em: Date;

  @Column({ type: 'datetime', name: 'cmn_modificado_em' })
  modificado_em: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'fk_usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => UserStory, (userStory) => userStory.id)
  @JoinColumn({ name: 'fk_user_story' })
  userStory: UserStory;
}
