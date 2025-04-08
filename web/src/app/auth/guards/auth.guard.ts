import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guarda de rota que verifica se o usuário está autenticado.
 * Permite acesso somente a usuários com token válido.
 * Redireciona para página de login caso contrário.
 *
 * @returns Verdadeiro se o usuário tiver um token válido, ou uma URL de redirecionamento
 */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Verifica se existe um token válido no serviço de autenticação
  if (!authService.hasValidToken()) {
    // Redireciona para a página de login se não houver token válido
    return router.parseUrl('/signin');
  }

  return true;
};

/**
 * Guarda de rota que verifica se o usuário NÃO está autenticado.
 * Utilizado para evitar acesso a páginas de login/registro quando o usuário
 * já está autenticado, redirecionando para o dashboard.
 *
 * @returns Verdadeiro se o usuário não tiver token válido, ou uma URL de redirecionamento
 */
export const isLoggedInGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Se houver um token válido, redireciona para o dashboard
  if (authService.hasValidToken()) {
    return router.parseUrl('/dashboard');
  }

  // Caso contrário, permite o acesso à página de login
  return true;
};
