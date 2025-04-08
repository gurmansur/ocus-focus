import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, isLoggedInGuard } from './auth/guards/auth.guard';

/**
 * Configuração das rotas principais da aplicação.
 * Inclui lazy loading para módulos de autenticação e dashboard.
 */
const routes: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    data: { title: 'Autenticação' },
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    data: { title: 'Dashboard' },
  },
  {
    // Rota de fallback para páginas não encontradas
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

/**
 * Módulo responsável pelo roteamento principal da aplicação.
 * Configura as rotas raiz e exporta o RouterModule para uso em toda aplicação.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking', // Melhora o tempo de carregamento inicial
      scrollPositionRestoration: 'enabled', // Restaura a posição de rolagem entre navegações
      useHash: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
