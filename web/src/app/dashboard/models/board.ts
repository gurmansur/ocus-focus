import { Swimlane } from './swimlane';

/**
 * Interface que representa um quadro Kanban.
 * Contém uma coleção de swimlanes.
 */
export interface IBoard {
  /** Nome do quadro */
  nome: string;
  
  /** Lista de swimlanes (colunas) que compõem o quadro */
  swimlanes: Swimlane[];
  
  /** Identificador único do quadro */
  id?: number;
}

/**
 * Classe que representa um quadro Kanban.
 * Utilizada para organização visual de user stories em swimlanes.
 */
export class Board implements IBoard {
  /** Nome do quadro */
  public nome: string;
  
  /** Lista de swimlanes (colunas) que compõem o quadro */
  public swimlanes: Swimlane[];
  
  /** Identificador único do quadro */
  public id?: number;

  /**
   * Cria uma nova instância de um quadro Kanban
   * @param nome Nome do quadro
   * @param swimlanes Lista de swimlanes
   * @param id Identificador único do quadro
   */
  constructor(nome: string = '', swimlanes: Swimlane[] = [], id?: number) {
    this.nome = nome;
    this.swimlanes = swimlanes;
    this.id = id;
  }
}
