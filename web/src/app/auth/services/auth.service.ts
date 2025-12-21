import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse } from '../../core/models/auth-response';
import { HttpClientService } from '../../core/services/http-client.service';
import { TokenService } from '../../core/services/token.service';
import { UserContextService } from '../../core/services/user-context.service';
import { Colaborador } from '../models/colaborador';
import { ColaboradorSignin } from '../models/colaborador-signin';
import { StakeholderSignin } from '../models/stakeholder-signin';

/**
 * Authentication service
 * Handles user authentication and user context management
 * Follows Single Responsibility Principle (only handles auth concerns)
 * Depends on core services for HTTP, token, and user context management
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpClientService: HttpClientService,
    private tokenService: TokenService,
    private userContextService: UserContextService,
  ) {}

  /**
   * Sign in as a collaborator (team member)
   * @param colaboradorSignin Login credentials
   * @returns Observable of auth response
   */
  signinColaborador(
    colaboradorSignin: ColaboradorSignin,
  ): Observable<AuthResponse> {
    return this.httpClientService
      .post<AuthResponse>('/signin-colaborador', colaboradorSignin)
      .pipe(
        tap((response) => {
          this.saveAuthContext(response);
        }),
      );
  }

  /**
   * Sign in as a stakeholder (external user)
   * @param stakeholderSignin Login credentials
   * @returns Observable of auth response
   */
  signinStakeholder(
    stakeholderSignin: StakeholderSignin,
  ): Observable<AuthResponse> {
    return this.httpClientService
      .post<AuthResponse>('/signin-stakeholder', stakeholderSignin)
      .pipe(
        tap((response) => {
          this.saveAuthContext(response);
        }),
      );
  }

  /**
   * Sign up a new collaborator
   * @param colaborador New user data
   * @returns Observable of auth response
   */
  signup(colaborador: Colaborador): Observable<AuthResponse> {
    return this.httpClientService
      .post<AuthResponse>('/signup', colaborador)
      .pipe(
        tap((response) => {
          this.saveAuthContext(response);
        }),
      );
  }

  /**
   * Verify if current login is still valid
   * @returns Observable of verification result
   */
  verifyLogin(): Observable<any> {
    return this.httpClientService.get('/verify');
  }

  /**
   * Log out the current user
   * Clears all authentication and user context data
   */
  logout(): void {
    this.tokenService.removeToken();
    this.userContextService.clearUserContext();
  }

  /**
   * Check if user is currently authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    return (
      this.tokenService.hasToken() && this.userContextService.isAuthenticated()
    );
  }

  /**
   * Save authentication context after successful login
   * @param response Authentication response from server
   */
  private saveAuthContext(response: AuthResponse): void {
    this.tokenService.setToken(response.accessToken);
    this.userContextService.setUserContext(
      response.usu_id,
      response.usu_email,
      response.usu_name,
      response.usu_role,
    );
  }
}
