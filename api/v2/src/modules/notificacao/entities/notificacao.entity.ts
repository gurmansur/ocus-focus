import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comentario } from '../../user-story/entities/comentario.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('NOTIFICACOES')
export class Notificacao {
  @PrimaryGeneratedColumn({ type: 'int', name: 'NTF_ID' })
  id: number;

  @Column({ type: 'varchar', name: 'NTF_MENSAGEM', length: 255 })
  mensagem: string;

  @Column({ type: 'tinyint', name: 'NTF_LIDO', default: 0 })
  lido: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'NTF_CRIADO_EM' })
  criado_em: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'FK_DESTINATARIO_USUARIO_ID' })
  destinatario: Usuario;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'FK_REMETENTE_USUARIO_ID' })
  remetente?: Usuario | null;

  @ManyToOne(() => UserStory, { nullable: true })
  @JoinColumn({ name: 'FK_USER_STORY' })
  userStory?: UserStory | null;

  @ManyToOne(() => Comentario, { nullable: true })
  @JoinColumn({ name: 'FK_COMENTARIO' })
  comentario?: Comentario | null;
}
