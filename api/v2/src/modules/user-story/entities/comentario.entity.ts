import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UserStory } from './user-story.entity';

@Entity('COMENTARIOS')
export class Comentario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CMN_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'CMN_COMENTARIO' })
  comentario: string;

  @CreateDateColumn({ name: 'CMN_CRIADO_EM' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'CMN_MODIFICADO_EM' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'CMN_DATA_EXCLUSAO' })
  deletedAt: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.id)
  @JoinColumn({ name: 'FK_USUARIO_ID' })
  usuario: Usuario;

  @ManyToOne(() => UserStory, (userStory) => userStory.id)
  @JoinColumn({ name: 'FK_USER_STORY' })
  userStory: UserStory;
}
