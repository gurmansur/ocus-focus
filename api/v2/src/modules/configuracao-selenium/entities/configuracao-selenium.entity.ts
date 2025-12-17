import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Projeto } from '../../projeto/entities/projeto.entity';

@Entity('CONFIGURACOES_SELENIUM')
export class ConfiguracaoSelenium {
  @PrimaryGeneratedColumn({ type: 'int', name: 'CFS_ID' })
  id: number;

  @Column('varchar', { name: 'CFS_NOME', length: 100 })
  nome: string;

  @Column('enum', {
    name: 'CFS_NAVEGADOR',
    enum: ['CHROME', 'FIREFOX', 'EDGE', 'SAFARI'],
    default: 'CHROME',
  })
  navegador: 'CHROME' | 'FIREFOX' | 'EDGE' | 'SAFARI';

  @Column('boolean', { name: 'CFS_HEADLESS', default: false })
  headless: boolean;

  @Column('int', { name: 'CFS_TIMEOUT_PADRAO', default: 30000 })
  timeoutPadrao: number;

  @Column('int', { name: 'CFS_TIMEOUT_IMPLICITO', default: 10000 })
  timeoutImplicito: number;

  @Column('int', { name: 'CFS_TIMEOUT_CARREGAMENTO_PAGINA', default: 60000 })
  timeoutCarregamentoPagina: number;

  @Column('varchar', {
    name: 'CFS_RESOLUCAO',
    length: 20,
    default: '1920x1080',
  })
  resolucao: string;

  @Column('boolean', { name: 'CFS_MAXIMIZAR_JANELA', default: true })
  maximizarJanela: boolean;

  @Column('boolean', { name: 'CFS_ACEITAR_CERTIFICADOS_SSL', default: true })
  aceitarCertificadosSSL: boolean;

  @Column('boolean', { name: 'CFS_CAPTURAR_SCREENSHOTS', default: true })
  capturarScreenshots: boolean;

  @Column('boolean', { name: 'CFS_CAPTURAR_LOGS', default: true })
  capturarLogs: boolean;

  @Column('varchar', {
    name: 'CFS_URL_SELENIUM_GRID',
    length: 255,
    nullable: true,
  })
  urlSeleniumGrid: string;

  @Column('json', { name: 'CFS_OPCOES_ADICIONAIS', nullable: true })
  opcoesAdicionais: Record<string, any>;

  @Column('varchar', {
    name: 'CFS_USER_AGENT',
    length: 255,
    nullable: true,
  })
  userAgent: string;

  @Column('varchar', {
    name: 'CFS_PROXY',
    length: 255,
    nullable: true,
  })
  proxy: string;

  @Column('boolean', { name: 'CFS_ATIVA', default: true })
  ativa: boolean;

  @CreateDateColumn({ name: 'CFS_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'CFS_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'CFS_DATA_EXCLUSAO' })
  dataExclusao: Date;

  @ManyToOne(() => Projeto, (projeto) => projeto.configuracoesSelenium)
  @JoinColumn({ name: 'FK_PROJETO_PRJ_ID' })
  projeto: Projeto;
}
