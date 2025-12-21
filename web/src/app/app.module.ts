import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Core module (singleton services, interceptors, guards)
import { CoreModule } from './core/core.module';

// Feature modules
import { AuthModule } from './auth/auth.module';

// Shared module (reusable components and common exports)
import { SharedModule } from './shared/shared.module';

/**
 * App Module
 * Root module of the application
 *
 * Module organization:
 * - CoreModule: Imported once for singleton services and interceptors
 * - SharedModule: Provides common Angular modules and reusable components
 * - AuthModule: Feature module for authentication
 * - DashboardModule: Lazy loaded as a feature module
 *
 * Follows Angular best practices:
 * - Keeps app module lean
 * - Uses CoreModule for singletons
 * - Uses lazy loading for feature modules
 * - Centralized HTTP client configuration
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    DragDropModule,
    AppRoutingModule,

    // Core module (must be imported only once in root)
    CoreModule,

    // Shared module (can be imported in multiple places)
    SharedModule,

    // Feature modules
    AuthModule,
    // DashboardModule is lazy loaded via routing
  ],
  providers: [
    provideAnimationsAsync(),
    // Temporary provider for backward compatibility with existing services
    // TODO: Migrate all services to use HttpClientService
    { provide: 'servicesRootUrl', useValue: 'http://localhost:3333' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
