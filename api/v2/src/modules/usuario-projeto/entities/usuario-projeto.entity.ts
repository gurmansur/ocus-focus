import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UserRole } from '../../usuario/enums/user-role.enum';

@Entity('USUARIOS_PROJETOS')
export class UsuarioProjeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'USP_ID' })
  id: number;

  @Column('boolean', { name: 'USP_ATIVO', default: true })
  ativo: boolean;

  @Column('boolean', { name: 'USP_ADMINISTRADOR', default: false })
  administrador: boolean;

  @Column({
    type: 'enum',
    name: 'USP_ROLE',
    enum: UserRole,
    default: UserRole.COLABORADOR,
  })
  role: UserRole;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'FK_USUARIOS_USU_ID' })
  usuario: Usuario;

  @ManyToOne(() => Projeto, (projeto) => projeto.usuariosProjetos)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;
}
