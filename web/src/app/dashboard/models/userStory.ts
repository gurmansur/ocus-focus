/**
 * Interface que representa uma história de usuário no sistema.
 * Utilizada para descrever funcionalidades do ponto de vista do usuário.
 */
export interface IUserStory {
  /** Título resumido da história de usuário */
  titulo: string;
  
  /** Descrição detalhada da história de usuário */
  descricao: string;
  
  /** Estimativa de tempo para implementação (em horas ou pontos) */
  estimativa_tempo: number;
  
  /** Data de criação da história */
  criado_em: string;
  
  /** Data da última modificação da história */
  modificado_em: string;
  
  /** ID do usuário que criou a história */
  criador: number;
  
  /** ID ou nome do usuário responsável pela implementação */
  responsavel: number | string;
  
  /** ID da swimlane onde a história está posicionada */
  swimlane: number;
  
  /** Identificador único da história */
  id?: number;
}

/**
 * Classe que representa uma história de usuário.
 * Contém todos os dados necessários para o acompanhamento
 * e desenvolvimento de uma funcionalidade.
 */
export class UserStory implements IUserStory {
  /** Título resumido da história de usuário */
  public titulo: string;
  
  /** Descrição detalhada da história de usuário */
  public descricao: string;
  
  /** Estimativa de tempo para implementação (em horas ou pontos) */
  public estimativa_tempo: number;
  
  /** Data de criação da história */
  public criado_em: string;
  
  /** Data da última modificação da história */
  public modificado_em: string;
  
  /** ID do usuário que criou a história */
  public criador: number;
  
  /** ID ou nome do usuário responsável pela implementação */
  public responsavel: number | string;
  
  /** ID da swimlane onde a história está posicionada */
  public swimlane: number;
  
  /** Identificador único da história */
  public id?: number;

  /**
   * Cria uma nova instância de história de usuário
   * @param titulo Título da história
   * @param descricao Descrição detalhada
   * @param estimativa_tempo Estimativa de tempo para implementação
   * @param criado_em Data de criação
   * @param modificado_em Data da última modificação
   * @param criador Usuário criador
   * @param responsavel Usuário responsável
   * @param swimlane Swimlane onde está posicionada
   * @param id Identificador único
   */
  constructor(
    titulo: string = '',
    descricao: string = '',
    estimativa_tempo: number = -1,
    criado_em: string = '',
    modificado_em: string = '',
    criador: number = -1,
    responsavel: number | string = -1,
    swimlane: number = -1,
    id?: number
  ) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.estimativa_tempo = estimativa_tempo;
    this.criado_em = criado_em;
    this.modificado_em = modificado_em;
    this.criador = criador;
    this.responsavel = responsavel;
    this.swimlane = swimlane;
    this.id = id;
  }
}
