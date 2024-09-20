import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export class Comentario {
  @PrimaryGeneratedColumn({ type: 'int', name: 'cmn_id' })
  id: number;

  @Column({ type: 'string', name: 'cmn_comentario' })
  comentario: string;

  @Column({ type: 'datetime', name: 'cmn_criado_em' })
  criado_em: Date;

  @Column({ type: 'datetime', name: 'cmn_modificado_em' })
  modificado_em: Date;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'fk_usuario_id' })
  usuario: Usuario;
}
