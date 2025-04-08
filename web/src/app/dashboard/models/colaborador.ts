/**
 * Interface que representa um colaborador no sistema.
 * Utilizada para exibição e gerenciamento de colaboradores nos projetos.
 */
export interface IColaborador {
  /** Nome completo do colaborador */
  nome: string;

  /** Email do colaborador (utilizado para login) */
  email: string;

  /** Empresa à qual o colaborador está vinculado */
  empresa: string;

  /** Cargo do colaborador na empresa */
  cargo: string;

  /** Identificador único do colaborador */
  id?: number;
}

/**
 * Classe para manipulação de dados de colaborador.
 * Mantida para compatibilidade com código existente.
 * @deprecated Utilize a interface IColaborador para novos desenvolvimentos
 */
export class Colaborador implements IColaborador {
  /** Nome completo do colaborador */
  public nome: string;

  /** Email do colaborador */
  public email: string;

  /** Empresa do colaborador */
  public empresa: string;

  /** Cargo do colaborador */
  public cargo: string;

  /** Identificador único */
  public id?: number;

  /**
   * Cria uma nova instância de colaborador
   * @param nome Nome do colaborador
   * @param email Email do colaborador
   * @param empresa Empresa do colaborador
   * @param cargo Cargo do colaborador
   * @param id Identificador único
   */
  constructor(
    nome: string,
    email: string,
    empresa: string,
    cargo: string,
    id?: number
  ) {
    this.nome = nome;
    this.email = email;
    this.empresa = empresa;
    this.cargo = cargo;
    this.id = id;
  }
}
