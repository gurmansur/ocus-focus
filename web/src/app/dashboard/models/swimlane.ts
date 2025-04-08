import { UserStory } from './userStory';

/**
 * Interface que representa uma raia (coluna) do quadro Kanban.
 * Contém uma coleção de user stories.
 */
export interface ISwimlane {
  /** Nome da raia */
  nome: string;

  /**
   * Indica se a raia é vertical (1/true) ou horizontal (0/false)
   * Usado para determinar a orientação visual no quadro
   */
  vertical: number | boolean;

  /** Cor de identificação da raia */
  cor: string;

  /** Lista de histórias de usuário contidas na raia */
  userStories: UserStory[];

  /** Identificador único da raia */
  id?: number;
}

/**
 * Classe que representa uma raia (coluna) no quadro Kanban.
 * Contém user stories e define sua organização visual.
 */
export class Swimlane implements ISwimlane {
  /** Nome da raia */
  public nome: string;

  /**
   * Indica se a raia é vertical (1/true) ou horizontal (0/false)
   * Usado para determinar a orientação visual no quadro
   */
  public vertical: number | boolean;

  /** Cor de identificação da raia */
  public cor: string;

  /** Lista de histórias de usuário contidas na raia */
  public userStories: UserStory[];

  /** Identificador único da raia */
  public id?: number;

  /**
   * Cria uma nova instância de swimlane
   * @param nome Nome da raia
   * @param vertical Orientação visual da raia
   * @param cor Cor de identificação
   * @param userStories Lista de histórias de usuário
   * @param id Identificador único
   */
  constructor(
    nome: string = '',
    vertical: number | boolean = 0,
    cor: string = '',
    userStories: UserStory[] = [],
    id?: number
  ) {
    this.nome = nome;
    this.vertical = vertical;
    this.cor = cor;
    this.userStories = userStories;
    this.id = id;
  }
}
