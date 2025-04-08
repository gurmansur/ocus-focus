/**
 * Interface que representa um colaborador no sistema.
 * Utilizada principalmente no processo de cadastro de novos usuários.
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
  
  /** Senha de acesso (não criptografada no frontend) */
  senha: string;
  
  /** Confirmação da senha para validação no cadastro */
  confirmarSenha: string;
}

/**
 * Classe para manipulação de dados de colaborador.
 * Mantida para compatibilidade com código existente.
 * @deprecated Utilize a interface IColaborador para novos desenvolvimentos
 */
export class Colaborador implements IColaborador {
  constructor(
    public nome: string,
    public email: string,
    public empresa: string,
    public cargo: string,
    public senha: string,
    public confirmarSenha: string
  ){}
}
