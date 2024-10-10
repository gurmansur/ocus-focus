import { Ator } from 'src/modules/ator/entities/ator.entity';
import { CasoDeTeste } from 'src/modules/caso-de-teste/entities/caso-de-teste.entity';
import { ColaboradorProjeto } from 'src/modules/colaborador-projeto/entities/colaborador-projeto.entity';
import { Estimativa } from 'src/modules/estimativa/entities/estimativa.entity';
import { FatorAmbientalProjeto } from 'src/modules/fator-ambiental-projeto/entities/fator-ambiental-projeto.entity';
import { FatorTecnicoProjeto } from 'src/modules/fator-tecnico-projeto/entities/fator-tecnico-projeto.entity';
import { RequisitoFuncional } from 'src/modules/requisito/entities/requisito-funcional.entity';
import { Stakeholder } from 'src/modules/stakeholder/entities/stakeholder.entity';
import { SuiteDeTeste } from 'src/modules/suite-de-teste/entities/suite-de-teste.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('PROJETOS')
export class Projeto {
  @PrimaryGeneratedColumn({ type: 'int', name: 'PRO_ID' })
  id: number;

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
}
