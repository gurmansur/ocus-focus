import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CasoDeTeste } from '../../caso-de-teste/entities/caso-de-teste.entity';
import { ColaboradorProjeto } from '../../colaborador-projeto/entities/colaborador-projeto.entity';
import { Comentario } from '../../user-story/entities/comentario.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

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

  @OneToMany(
    () => CasoDeTeste,
    (casoDeTeste) => casoDeTeste.testadorDesignado,
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'FK_COLABORADORES_COL_ID' })
  casosDeTeste: CasoDeTeste[];

  @OneToMany(() => UserStory, (userStory) => userStory.responsavel)
  responsavelUS: UserStory[];

  @OneToMany(() => UserStory, (userStory) => userStory.criador)
  criadorUS: UserStory[];

  @ManyToMany(() => UserStory, (userStory) => userStory.participantes)
  participantesUS: UserStory[];

  @OneToMany(() => Comentario, (comentario) => comentario.usuario)
  comentarios: Comentario[];
}
