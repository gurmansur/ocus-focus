import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Ator } from '../../ator/entities/ator.entity';
import { CasoDeTeste } from '../../caso-de-teste/entities/caso-de-teste.entity';
import { ColaboradorProjeto } from '../../colaborador-projeto/entities/colaborador-projeto.entity';
import { ConfiguracaoSelenium } from '../../configuracao-selenium/entities/configuracao-selenium.entity';
import { Estimativa } from '../../estimativa/entities/estimativa.entity';
import { FatorAmbientalProjeto } from '../../fator-ambiental-projeto/entities/fator-ambiental-projeto.entity';
import { FatorTecnicoProjeto } from '../../fator-tecnico-projeto/entities/fator-tecnico-projeto.entity';
import { RequisitoFuncional } from '../../requisito/entities/requisito-funcional.entity';
import { Sprint } from '../../sprint/entities/sprint.entity';
import { Stakeholder } from '../../stakeholder/entities/stakeholder.entity';
import { SuiteDeTeste } from '../../suite-de-teste/entities/suite-de-teste.entity';
import { UserStory } from '../../user-story/entities/user-story.entity';

@Entity('PROJETOS')
export class Projeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'PRO_ID' })
  id: number;

  @CreateDateColumn({ name: 'PRO_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'PRO_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'PRO_DATA_EXCLUSAO' })
  dataExclusao: Date;

  @Column('varchar', { name: 'PRO_NOME', length: 100 })
  nome: string;

  @Column('varchar', { name: 'PRO_DESCRICAO', length: 255 })
  descricao: string;

  @Column('varchar', { name: 'PRO_EMPRESA', length: 50 })
  empresa: string;

  @Column('date', { name: 'PRO_DATA_INICIO' })
  dataInicio: Date;

  @Column('date', { name: 'PRO_PREVISAO_FIM' })
  previsaoFim: Date;

  @Column('enum', {
    name: 'PRO_STATUS',
    enum: ['EM ANDAMENTO', 'FINALIZADO', 'CANCELADO'],
    default: 'EM ANDAMENTO',
  })
  status: 'EM ANDAMENTO' | 'FINALIZADO' | 'CANCELADO';

  @Column('double', {
    name: 'PRO_RESTFACTOR',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  restFactor: number;

  @Column('double', {
    name: 'PRO_RESEFACTOR',
    precision: 4,
    scale: 2,
    nullable: true,
  })
  reseFactor: number;

  @OneToMany(() => Ator, (ator) => ator.projeto)
  atores: Ator[];

  @OneToMany(() => RequisitoFuncional, (requisito) => requisito.projeto)
  requisitos: RequisitoFuncional[];

  @OneToMany(() => Estimativa, (estimativa) => estimativa.projeto)
  estimativas: Estimativa[];

  @OneToMany(() => Stakeholder, (stakeholder) => stakeholder.projeto)
  stakeholders: Stakeholder[];

  @OneToMany(
    () => FatorTecnicoProjeto,
    (fatorTecnicoProjeto) => fatorTecnicoProjeto.projeto,
  )
  fatoresTecnicos: FatorTecnicoProjeto[];

  @OneToMany(
    () => FatorAmbientalProjeto,
    (fatorAmbientalProjeto) => fatorAmbientalProjeto.projeto,
  )
  fatoresAmbientais: FatorAmbientalProjeto[];

  @OneToMany(() => ColaboradorProjeto, (colaborador) => colaborador.projeto)
  colaboradores: ColaboradorProjeto[];

  @OneToMany(() => SuiteDeTeste, (suiteDeTeste) => suiteDeTeste.projeto)
  suitesDeTeste: SuiteDeTeste[];

  @OneToMany(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.projeto)
  casosDeTeste: CasoDeTeste[];

  @OneToMany(
    () => ConfiguracaoSelenium,
    (configuracaoSelenium) => configuracaoSelenium.projeto,
  )
  configuracoesSelenium: ConfiguracaoSelenium[];

  @OneToMany(() => Sprint, (sprint) => sprint.id)
  sprints: Sprint[];

  @OneToMany(() => UserStory, (userStory) => userStory.id)
  userStories: UserStory[];
}
