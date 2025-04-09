import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../../auth/services/auth.service';

export const colaboradorGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  try {
    // Verificar se existe um token válido primeiro
    if (!authService.hasValidToken()) {
      return router.parseUrl('/');
    }

    // Obter dados do usuário do AuthService
    const userData = authService.getUserData();
    const role = userData?.role || storageService.getItem('usu_role');

    if (role === 'colaborador') {
      return true;
    }

    return router.parseUrl('/dashboard/painel-stakeholder');
  } catch (error) {
    console.error('Erro no guard de colaborador:', error);
    return router.parseUrl('/');
  }
};

export const stakeholderGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  try {
    // Verificar se existe um token válido primeiro
    if (!authService.hasValidToken()) {
      return router.parseUrl('/');
    }

    // Obter dados do usuário do AuthService
    const userData = authService.getUserData();
    const role = userData?.role || storageService.getItem('usu_role');

    if (role === 'stakeholder') {
      return true;
    }

    return router.parseUrl('/dashboard/projetos');
  } catch (error) {
    console.error('Erro no guard de stakeholder:', error);
    return router.parseUrl('/');
  }
};
