import { Arquivo } from 'src/modules/arquivo/entities/arquivo.entity';
import { Subtarefa } from 'src/modules/subtarefa/entities/subtarefa.entity';
import { Tag } from 'src/modules/tag/entities/tag.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import {
  Column,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comentario } from './comentario.entity';

export class UserStory {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ust_id' })
  id: number;

  @Column({ type: 'string', name: 'ust_nome' })
  nome: string;

  @Column({ type: 'string', name: 'ust_descricao' })
  descricao: string;

  @Column({ type: 'int', name: 'ust_estimativa_tempo' })
  estimativa_tempo: number;

  comentarios: Comentario[];

  @ManyToMany(() => Tag)
  @JoinColumn({
    name: 'fk_tag_id',
  })
  tags: Tag[];

  subtarefas: Subtarefa[];

  @ManyToMany(() => Arquivo)
  @JoinColumn({
    name: 'fk_anexo_id',
  })
  anexos: Arquivo[];

  // TODO Acho que aqui seria um One to many, porque o usuario pode criar várias
  // US, mas uma US só pode ser criada por um usuario
  criador: Usuario;

  // TODO Aqui a mesma coisa
  responsavel: Usuario;

  @ManyToMany(() => Usuario)
  @JoinColumn({
    name: 'fk_usuario_id',
  })
  participantes: Usuario[];

  @Column({ type: 'datetime', name: 'ust_criado_em' })
  criado_em: Date;

  @Column({ type: 'datetime', name: 'ust_modificado_em' })
  modificado_em: Date;
}
