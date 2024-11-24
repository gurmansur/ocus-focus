import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CasoUso } from '../../caso-uso/entities/caso-uso.entity';
import { Colaborador } from '../../colaborador/entities/colaborador.entity';
import { ExecucaoDeTeste } from '../../execucao-de-teste/entities/execucao-de-teste.entity';
import { Projeto } from '../../projeto/entities/projeto.entity';
import { SuiteDeTeste } from '../../suite-de-teste/entities/suite-de-teste.entity';

@Entity('CASOS_DE_TESTE')
export class CasoDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CDT_ID' })
  id: number;

  @Column('varchar', { name: 'CDT_NOME', length: 50 })
  nome: string;

  @Column('enum', {
    name: 'CDT_STATUS',
    enum: ['ATIVO', 'INATIVO'],
    default: 'ATIVO',
  })
  status: 'ATIVO' | 'INATIVO';

  @Column('enum', {
    name: 'CDT_METODO',
    enum: ['MANUAL', 'AUTOMATIZADO'],
    default: 'MANUAL',
  })
  metodo: 'MANUAL' | 'AUTOMATIZADO';

  @Column('enum', {
    name: 'CDT_TECNICA',
    enum: ['FUNCIONAL', 'ESTRUTURAL'],
    default: 'FUNCIONAL',
  })
  tecnica: 'FUNCIONAL' | 'ESTRUTURAL';

  @Column('enum', {
    name: 'CDT_PRIORIDADE',
    enum: ['ALTA', 'MEDIA', 'BAIXA'],
    default: 'MEDIA',
  })
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';

  @Column('enum', {
    name: 'CDT_COMPLEXIDADE',
    enum: ['SIMPLES', 'MEDIO', 'COMPLEXO'],
    default: 'SIMPLES',
  })
  complexidade: 'SIMPLES' | 'MEDIO' | 'COMPLEXO';

  @Column('varchar', { name: 'CDT_DESCRICAO', length: 255 })
  descricao: string;

  @Column('varchar', { name: 'CDT_OBSERVACOES', length: 255 })
  observacoes: string;

  @Column('varchar', { name: 'CDT_PRE_CONDICAO', length: 255 })
  preCondicao: string;

  @Column('varchar', { name: 'CDT_POS_CONDICAO', length: 255 })
  posCondicao: string;

  @Column('text', { name: 'CDT_DADOS_ENTRADA' })
  dadosEntrada: string;

  @Column('text', { name: 'CDT_RESULTADO_ESPERADO' })
  resultadoEsperado: string;

  @ManyToOne(() => CasoUso, (casoUso: CasoUso) => casoUso.casosDeTeste)
  @JoinColumn({ name: 'FK_CASOS_DE_USO_CAS_ID' })
  casoDeUso: CasoUso;

  @CreateDateColumn({ name: 'CDT_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'CDT_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'CDT_DATA_EXCLUSAO' })
  dataExclusao: Date;

  @ManyToOne(
    () => SuiteDeTeste,
    (suiteDeTeste: SuiteDeTeste) => suiteDeTeste.casosDeTeste,
  )
  @JoinColumn({ name: 'FK_SUITE_DE_TESTE_SDT_ID' })
  suiteDeTeste: SuiteDeTeste;

  @ManyToOne(
    () => Colaborador,
    (colaborador: Colaborador) => colaborador.casosDeTeste,
    {
      nullable: true,
      eager: true,
    },
  )
  @JoinColumn({ name: 'FK_COLABORADORES_COL_ID' })
  testadorDesignado: Colaborador;

  @OneToMany(
    () => ExecucaoDeTeste,
    (execucaoDeTeste) => execucaoDeTeste.casoDeTeste,
  )
  execucoesDeTeste: ExecucaoDeTeste[];

  @ManyToOne(() => Projeto, (projeto) => projeto.casosDeTeste)
  @JoinColumn({ name: 'FK_PROJETO_PRO_ID' })
  projeto: Projeto;
}
