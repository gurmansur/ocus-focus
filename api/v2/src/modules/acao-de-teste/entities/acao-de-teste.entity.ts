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
import { CasoDeTeste } from '../../caso-de-teste/entities/caso-de-teste.entity';

@Entity('ACOES_DE_TESTE')
export class AcaoDeTeste {
  @PrimaryGeneratedColumn({ type: 'int', name: 'ACT_ID' })
  id: number;

  @Column('int', { name: 'ACT_ORDEM' })
  ordem: number;

  @Column('enum', {
    name: 'ACT_TIPO',
    enum: [
      'NAVEGAR',
      'CLICAR',
      'DIGITAR',
      'SELECIONAR',
      'ESPERAR',
      'VALIDAR_TEXTO',
      'VALIDAR_ELEMENTO',
      'SCREENSHOT',
      'EXECUTAR_SCRIPT',
      'SCROLL',
      'HOVER',
      'DUPLO_CLIQUE',
      'CLICAR_DIREITO',
      'LIMPAR_CAMPO',
      'PRESSIONAR_TECLA',
      'UPLOAD_ARQUIVO',
      'TROCAR_JANELA',
      'TROCAR_FRAME',
      'ACEITAR_ALERTA',
      'REJEITAR_ALERTA',
      'OBTER_TEXTO_ALERTA',
      'PASSO_MANUAL',
    ],
  })
  tipo:
    | 'NAVEGAR'
    | 'CLICAR'
    | 'DIGITAR'
    | 'SELECIONAR'
    | 'ESPERAR'
    | 'VALIDAR_TEXTO'
    | 'VALIDAR_ELEMENTO'
    | 'SCREENSHOT'
    | 'EXECUTAR_SCRIPT'
    | 'SCROLL'
    | 'HOVER'
    | 'DUPLO_CLIQUE'
    | 'CLICAR_DIREITO'
    | 'LIMPAR_CAMPO'
    | 'PRESSIONAR_TECLA'
    | 'UPLOAD_ARQUIVO'
    | 'TROCAR_JANELA'
    | 'TROCAR_FRAME'
    | 'ACEITAR_ALERTA'
    | 'REJEITAR_ALERTA'
    | 'OBTER_TEXTO_ALERTA'
    | 'PASSO_MANUAL';

  @Column('enum', {
    name: 'ACT_EXECUCAO_TIPO',
    enum: ['MANUAL', 'AUTOMATIZADO'],
    default: 'AUTOMATIZADO',
  })
  execucaoTipo: 'MANUAL' | 'AUTOMATIZADO';

  @Column('varchar', { name: 'ACT_SELETOR', length: 255, nullable: true })
  seletor: string;

  @Column('enum', {
    name: 'ACT_TIPO_SELETOR',
    enum: ['ID', 'CLASS', 'CSS', 'XPATH', 'NAME', 'TAG', 'LINK_TEXT'],
    nullable: true,
  })
  tipoSeletor: 'ID' | 'CLASS' | 'CSS' | 'XPATH' | 'NAME' | 'TAG' | 'LINK_TEXT';

  @Column('varchar', { name: 'ACT_VALOR', length: 500, nullable: true })
  valor: string;

  @Column('int', { name: 'ACT_TIMEOUT', default: 5000 })
  timeout: number;

  @Column('varchar', { name: 'ACT_DESCRICAO', length: 255, nullable: true })
  descricao: string;

  @Column('boolean', { name: 'ACT_OBRIGATORIO', default: true })
  obrigatorio: boolean;

  @Column('varchar', {
    name: 'ACT_MENSAGEM_ERRO',
    length: 255,
    nullable: true,
  })
  mensagemErro: string;

  @Column('text', { name: 'ACT_INSTRUCAO_MANUAL', nullable: true })
  instrucaoManual: string;

  @Column('text', { name: 'ACT_RESULTADO_MANUAL', nullable: true })
  resultadoManual: string;

  @CreateDateColumn({ name: 'ACT_DATA_CRIACAO' })
  dataCriacao: Date;

  @UpdateDateColumn({ name: 'ACT_DATA_ATUALIZACAO' })
  dataAtualizacao: Date;

  @DeleteDateColumn({ name: 'ACT_DATA_EXCLUSAO' })
  dataExclusao: Date;

  @ManyToOne(() => CasoDeTeste, (casoDeTeste) => casoDeTeste.acoesDeTeste, {
    eager: true,
  })
  @JoinColumn({ name: 'FK_CASO_DE_TESTE_CDT_ID' })
  casoDeTeste: CasoDeTeste;
}
