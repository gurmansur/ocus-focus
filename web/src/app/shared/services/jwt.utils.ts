/**
 * Interface para payload do JWT decodificado
 */
export interface JwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

/**
 * Classe utilitária para manipulação de tokens JWT (JSON Web Token).
 * Segue o princípio de responsabilidade única, focando apenas na manipulação
 * e validação de tokens JWT.
 */
export class JwtUtils {
  /**
   * Decodifica um token JWT sem verificar a assinatura
   * @param token Token JWT a ser decodificado
   * @returns Payload do token ou null se token inválido
   */
  static decodeToken(token: string): JwtPayload | null {
    if (!token || typeof token !== 'string') {
      return null;
    }

    try {
      // Verifica se é um JWT válido (3 partes separadas por ponto)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      // Decodifica a parte do payload (segunda parte)
      const payload = JSON.parse(atob(parts[1]));
      return payload;
    } catch (error) {
      console.error('Erro ao decodificar token JWT:', error);
      return null;
    }
  }

  /**
   * Verifica se um token JWT está expirado
   * @param token Token JWT a ser verificado
   * @returns true se o token estiver expirado, false caso contrário
   */
  static isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);

    if (!payload || !payload.exp) {
      // Se não for possível decodificar ou não tiver data de expiração,
      // consideramos expirado por segurança
      return true;
    }

    // A expiração é em segundos, então multiplicamos por 1000 para comparar com Date.now()
    return payload.exp * 1000 < Date.now();
  }

  /**
   * Verifica se um token JWT é válido (bem formado e não expirado)
   * @param token Token JWT a ser verificado
   * @returns true se o token for válido, false caso contrário
   */
  static isValidToken(token: string): boolean {
    if (!token) {
      return false;
    }

    // Verifica se o token é bem formado e não está expirado
    const payload = this.decodeToken(token);
    return !!payload && !this.isTokenExpired(token);
  }

  /**
   * Extrai informações do usuário do token JWT
   * @param token Token JWT
   * @returns Objeto com informações do usuário ou null
   */
  static extractUserInfo(
    token: string
  ): { id?: number | string; email?: string; role?: string } | null {
    const payload = this.decodeToken(token);

    if (!payload) {
      return null;
    }

    // Aqui assumimos uma estrutura comum em JWTs para informações de usuário,
    // mas isso pode variar dependendo de como o token é gerado no backend
    return {
      id: payload.sub || payload['id'] || payload['userId'],
      email: payload['email'],
      role: payload['role'],
    };
  }
}
