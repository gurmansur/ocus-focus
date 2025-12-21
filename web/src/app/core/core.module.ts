import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';

// Services
import { ConfigService } from './services/config.service';
import { HttpClientService } from './services/http-client.service';
import { ProjectContextService } from './services/project-context.service';
import { StorageService } from './services/storage.service';
import { TokenService } from './services/token.service';
import { UserContextService } from './services/user-context.service';

// Interceptors
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';

// Guards (already exist in auth module, but can be imported/exported here)

/**
 * Core module containing singleton services, interceptors, and guards
 * This module should be imported only once in AppModule
 *
 * Follows Angular best practices:
 * - Single responsibility principle (each service has one job)
 * - Dependency inversion (depends on abstractions)
 * - DRY principle (centralized HTTP, token, and storage logic)
 * - Lazy loading compatible (services use providedIn: 'root')
 *
 * Services:
 * - StorageService: Browser storage abstraction
 * - TokenService: JWT token management
 * - UserContextService: User data management
 * - ProjectContextService: Project context management
 * - ConfigService: Application configuration
 * - HttpClientService: Centralized HTTP operations with auto auth headers
 *
 * Interceptors (registered in order):
 * 1. ErrorInterceptor: Centralized error handling
 * 2. TokenInterceptor: Auto token injection and project context
 * 3. CachingInterceptor: GET request caching
 */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    // Services
    StorageService,
    TokenService,
    UserContextService,
    ProjectContextService,
    ConfigService,
    HttpClientService,

    // Interceptors (order matters - they execute top to bottom)
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CachingInterceptor,
    //   multi: true,
    // },
  ],
})
export class CoreModule {}
