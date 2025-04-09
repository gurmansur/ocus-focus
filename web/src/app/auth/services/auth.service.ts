import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { JwtUtils } from '../../shared/services/jwt.utils';
import { StorageService } from '../../shared/services/storage.service';
import { Colaborador } from '../models/colaborador';
import { ColaboradorSignin } from '../models/colaborador-signin';
import { StakeholderSignin } from '../models/stakeholder-signin';

/**
 * Interface para a resposta de autenticação do colaborador
 */
interface IColaboradorAuthResponse {
  accessToken: string;
  usu_email: string;
  usu_name: string;
  usu_id: number;
  usu_role: string;
  message: string;
}

/**
 * Interface para a resposta de autenticação do stakeholder
 */
interface IStakeholderAuthResponse {
  accessToken: string;
  message: string;
  [key: string]: unknown;
}

/**
 * Interface para a resposta de verificação de login
 */
interface IVerifyLoginResponse {
  isValid: boolean;
  message?: string;
  userData?: {
    email: string;
    name: string;
    id: number;
    role: string;
  };
}

/**
 * Interface para dados do usuário autenticado
 */
interface IUserData {
  email: string;
  name: string;
  id: number;
  role: string;
}

/**
 * Serviço responsável por gerenciar as operações de autenticação
 * e registro de usuários na aplicação.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_DATA_KEY = 'userData';

  /**
   * Cabeçalhos HTTP com autenticação para reutilização nas requisições
   */
  private get authHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
    private storageService: StorageService
  ) {}

  /**
   * Realiza a autenticação de um colaborador
   * @param colaboradorSignin Dados de login do colaborador
   * @returns Observable com a resposta da autenticação
   */
  signinColaborador(
    colaboradorSignin: ColaboradorSignin
  ): Observable<IColaboradorAuthResponse> {
    return this.httpClient
      .post<IColaboradorAuthResponse>(
        `${this.servicesRootUrl}/signin-colaborador`,
        colaboradorSignin,
        { responseType: 'json' }
      )
      .pipe(
        tap((response) => {
          // Armazena token e dados do usuário
          this.saveToken(response.accessToken);
          this.saveUserData({
            email: response.usu_email,
            name: response.usu_name,
            id: response.usu_id,
            role: response.usu_role,
          });
        }),
        catchError((error) => {
          console.error('Erro ao autenticar colaborador:', error);
          throw error;
        })
      );
  }

  /**
   * Realiza a autenticação de um stakeholder
   * @param stakeholderSignin Dados de login do stakeholder
   * @returns Observable com a resposta da autenticação
   */
  signinStakeholder(
    stakeholderSignin: StakeholderSignin
  ): Observable<IStakeholderAuthResponse> {
    return this.httpClient
      .post<IStakeholderAuthResponse>(
        `${this.servicesRootUrl}/signin-stakeholder`,
        stakeholderSignin
      )
      .pipe(
        tap((response) => {
          if (response.accessToken) {
            this.saveToken(response.accessToken);

            // Tenta extrair dados do usuário do token
            try {
              const userInfo = JwtUtils.extractUserInfo(response.accessToken);
              if (userInfo && userInfo.email) {
                this.saveUserData({
                  email: userInfo.email,
                  name: userInfo.email.split('@')[0], // Usar parte do email como nome se não tiver outro
                  id: Number(userInfo.id) || 0,
                  role: userInfo.role || 'stakeholder',
                });
              }
            } catch (error) {
              console.error('Erro ao extrair informações do token:', error);
              // Ainda continua mesmo se tiver erro na extração dos dados
            }
          }
        }),
        catchError((error) => {
          console.error('Erro ao autenticar stakeholder:', error);
          throw error;
        })
      );
  }

  /**
   * Registra um novo colaborador
   * @param colaborador Dados do colaborador a ser registrado
   * @returns Observable com a resposta do registro
   */
  signup(colaborador: Colaborador): Observable<Colaborador> {
    return this.httpClient.post<Colaborador>(
      `${this.servicesRootUrl}/signup`,
      colaborador
    );
  }

  /**
   * Verifica se o token de autenticação atual é válido
   * @returns Observable com o resultado da verificação
   */
  verifyLogin(): Observable<IVerifyLoginResponse> {
    if (!this.hasValidToken()) {
      return of({ isValid: false, message: 'Token inválido ou expirado' });
    }

    return this.httpClient
      .get<IVerifyLoginResponse>(`${this.servicesRootUrl}/verify`, {
        headers: this.authHeaders,
      })
      .pipe(
        tap((response) => {
          if (response.isValid && response.userData) {
            this.saveUserData(response.userData);
          }
        }),
        catchError((error) => {
          console.error('Erro ao verificar login:', error);
          this.logout();
          return of({
            isValid: false,
            message: error.message || 'Erro ao verificar autenticação',
          });
        })
      );
  }

  /**
   * Realiza o logout do usuário atual
   */
  logout(): void {
    this.storageService.removeToken();
    this.storageService.removeItem(this.USER_DATA_KEY);
  }

  /**
   * Armazena o token de autenticação após login bem-sucedido
   * @param token Token de autenticação a ser armazenado
   */
  saveToken(token: string): void {
    this.storageService.setToken(token);
  }

  /**
   * Armazena os dados do usuário autenticado
   * @param userData Dados do usuário
   */
  private saveUserData(userData: IUserData): void {
    this.storageService.setObject(this.USER_DATA_KEY, userData);
  }

  /**
   * Obtém os dados do usuário autenticado
   * @returns Dados do usuário ou null se não estiver autenticado
   */
  getUserData(): IUserData | null {
    return this.storageService.getObject<IUserData>(this.USER_DATA_KEY);
  }

  /**
   * Verifica se existe um token válido
   * @returns true se existir um token válido, false caso contrário
   */
  hasValidToken(): boolean {
    try {
      const token = this.storageService.getToken();
      if (!token) {
        return false;
      }
      
      const isValid = JwtUtils.isValidToken(token);
      if (!isValid) {
        // Se o token não for válido, faz logout para limpar dados
        this.logout();
      }
      
      return isValid;
    } catch (error) {
      console.error('Erro ao verificar validade do token:', error);
      // Em caso de erro, faz logout e retorna false para segurança
      try {
        this.logout();
      } catch (logoutError) {
        console.error('Erro ao fazer logout após falha na validação do token:', logoutError);
      }
      return false;
    }
  }
}
