import { Colaborador } from 'src/modules/colaborador/entities/colaborador.entity';
import { Projeto } from 'src/modules/projeto/entities/projeto.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('COLABORADORES_PROJETOS')
export class ColaboradorProjeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'COP_ID' })
  id: number;

  @Column('boolean', { name: 'COP_ATIVO' })
  ativo: boolean;

  @Column('boolean', { name: 'COP_ADMINISTRADOR' })
  administrador: boolean;

  @ManyToOne(() => Colaborador, (colaborador) => colaborador.projetos)
  @JoinColumn({ name: 'FK_COLABORADORES_COL_ID' })
  colaborador: Colaborador;

  @ManyToOne(() => Usuario, (usuario) => usuario.projetos)
  @JoinColumn({ name: 'FK_COLABORADORES_FK_USUARIOS_USU_ID' })
  usuario: Usuario;

  @ManyToOne(() => Projeto, (projeto) => projeto.colaboradores)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;
}
