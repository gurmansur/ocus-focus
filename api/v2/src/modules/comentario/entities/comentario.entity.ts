import { ApiProperty } from '@nestjs/swagger';
import { Colaborador } from 'src/modules/colaborador/entities/colaborador.entity';
import { UserStory } from 'src/modules/user-story/entities/user-story.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('COMENTARIOS')
export class Comentario {
  @ApiProperty({
    description: 'Identificador único do comentário',
    type: 'integer',
    example: 1,
  })
  @PrimaryGeneratedColumn({ type: 'int', name: 'cmn_id' })
  id: number;

  @ApiProperty({
    description: 'Comentário',
    type: 'string',
    example: 'Comentário de exemplo',
    required: true,
  })
  @Column({ type: 'varchar', name: 'cmn_comentario' })
  comentario: string;

  @ApiProperty({
    description: 'Data de criação do comentário',
    type: 'timestamp',
    example: '2021-12-31 23:59:59',
    default: new Date().getTime(),
  })
  @Column({
    type: 'timestamp',
    name: 'cmn_criado_em',
    default: () => 'CURRENT_TIMESTAMP',
  })
  criado_em: Date;

  @ApiProperty({
    description: 'Data de modificação do comentário',
    type: 'timestamp',
    example: '2021-12-31 23:59:59',
    default: 'CURRENT_TIMESTAMP',
  })
  @Column({
    type: 'timestamp',
    name: 'cmn_modificado_em',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  modificado_em: Date;

  @ApiProperty({
    description: 'Identifica se o comentário foi deletado',
    example: true,
    type: 'boolean',
    default: false,
  })
  @Column({
    type: 'boolean',
    name: 'cmn_deletado',
    default: false,
  })
  deletado: boolean;

  @ApiProperty({
    required: true,
    type: 'integer',
    description: 'Identificador do usuário que fez o comentário',
  })
  @ManyToOne(() => Colaborador, (colaborador) => colaborador.id)
  @JoinColumn({ name: 'fk_usuario_id' })
  usuario: Colaborador;

  @ApiProperty({
    required: true,
    type: 'integer',
    description: 'Identificador da user story que o comentário pertence',
  })
  @ManyToOne(() => UserStory, (userStory) => userStory.id)
  @JoinColumn({ name: 'fk_user_story' })
  userStory: UserStory;
}
