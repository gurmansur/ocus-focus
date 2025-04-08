/**
 * Interface que representa as credenciais de login do colaborador.
 * Utilizada no processo de autenticação.
 */
export interface IColaboradorSignin {
  /** Email do colaborador (utilizado como identificador) */
  email: string;
  
  /** Senha de acesso */
  senha: string;
}

/**
 * Classe para manipulação de dados de login do colaborador.
 * Mantida para compatibilidade com código existente.
 * @deprecated Utilize a interface IColaboradorSignin para novos desenvolvimentos
 */
export class ColaboradorSignin implements IColaboradorSignin {
  constructor(
    public email: string,
    public senha: string
  ){}
}
