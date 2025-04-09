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
        console.warn('Token JWT inválido: formato incorreto');
        return null;
      }

      // Decodifica a parte do payload (segunda parte)
      // Adiciona padding se necessário para evitar erros de base64
      const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - base64Payload.length % 4) % 4);
      const base64 = base64Payload + padding;
      
      try {
        const payload = JSON.parse(atob(base64));
        return payload;
      } catch (parseError) {
        console.error('Erro ao fazer parse do payload JWT:', parseError);
        return null;
      }
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
    if (!token) {
      return true;
    }
    
    const payload = this.decodeToken(token);

    if (!payload || !payload.exp) {
      // Se não for possível decodificar ou não tiver data de expiração,
      // consideramos expirado por segurança
      return true;
    }

    try {
      // A expiração é em segundos, então multiplicamos por 1000 para comparar com Date.now()
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Erro ao verificar expiração do token:', error);
      return true; // Por segurança, considera expirado em caso de erro
    }
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

    try {
      // Verifica se o token é bem formado e não está expirado
      const payload = this.decodeToken(token);
      return !!payload && !this.isTokenExpired(token);
    } catch (error) {
      console.error('Erro ao validar token:', error);
      return false;
    }
  }

  /**
   * Extrai informações do usuário do token JWT
   * @param token Token JWT
   * @returns Objeto com informações do usuário ou null
   */
  static extractUserInfo(
    token: string
  ): { id?: number | string; email?: string; role?: string } | null {
    if (!token) {
      return null;
    }
    
    try {
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
    } catch (error) {
      console.error('Erro ao extrair informações do usuário do token:', error);
      return null;
    }
  }
}
