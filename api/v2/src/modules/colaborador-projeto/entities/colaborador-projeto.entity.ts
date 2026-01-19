import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

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

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'FK_COLABORADORES_FK_USUARIOS_USU_ID' })
  usuario: Usuario;

  @ManyToOne(() => Projeto)
  @JoinColumn({ name: 'FK_PROJETOS_PRO_ID' })
  projeto: Projeto;
}
