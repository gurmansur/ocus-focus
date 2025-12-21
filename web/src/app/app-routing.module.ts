import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, isLoggedInGuard } from './auth/guards/auth.guard';

/**
 * App routing configuration
 *
 * Route structure:
 * - '' (root): Auth module (login, signup, etc.)
 * - 'dashboard': Dashboard module (lazy loaded)
 *
 * Guards:
 * - authGuard: Requires authentication for protected routes
 * - isLoggedInGuard: Prevents logged-in users from accessing auth routes
 *
 * Best practices implemented:
 * - Lazy loading of feature modules reduces initial bundle size
 * - Route guards protect against unauthorized access
 * - Clear separation of concerns (auth vs dashboard)
 */
const routes: Routes = [
  {
    path: '',
    canActivate: [isLoggedInGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  // Wildcard route - redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
