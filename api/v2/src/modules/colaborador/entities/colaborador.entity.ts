import { ColaboradorProjeto } from 'src/modules/colaborador-projeto/entities/colaborador-projeto.entity';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('COLABORADORES')
export class Colaborador {
  @PrimaryGeneratedColumn({ type: 'int', name: 'COL_ID' })
  id: number;

  @Column('varchar', { name: 'COL_NOME', length: 100 })
  nome: string;

  @Column('varchar', { name: 'COL_EMAIL', length: 255 })
  email: string;

  @Column('varchar', { name: 'COL_SENHA', length: 100 })
  senha: string;

  @Column('varchar', { name: 'COL_EMPRESA', length: 30 })
  empresa: string;

  @Column('enum', {
    name: 'COL_CARGO',
    enum: [
      'Gerente de Projeto',
      'Analista de Sistemas',
      'Desenvolvedor',
      'Product Owner',
      'Scrum Master',
    ],
    default: 'Desenvolvedor',
  })
  cargo:
    | 'Gerente de Projeto'
    | 'Analista de Sistemas'
    | 'Desenvolvedor'
    | 'Product Owner'
    | 'Scrum Master';

  @ManyToOne(() => Usuario, (usuario) => usuario.colaboradores)
  @JoinColumn({ name: 'FK_USUARIOS_USU_ID' })
  usuario: Usuario;

  @OneToMany(
    () => ColaboradorProjeto,
    (colaboradorProjeto) => colaboradorProjeto.colaborador,
  )
  projetos: ColaboradorProjeto[];
}
