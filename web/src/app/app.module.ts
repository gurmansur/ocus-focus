import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Módulos da aplicação
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';
import { InterceptorModule } from './dashboard/interceptors/interceptor.module';
import { SharedServicesModule } from './shared/services/shared-services.module';

// Componentes
import { AppComponent } from './app.component';

/**
 * Módulo principal da aplicação.
 * Responsável por importar e configurar todos os módulos necessários
 * para o funcionamento da aplicação.
 */
@NgModule({
  declarations: [AppComponent],
  imports: [
    // Módulos Angular
    BrowserModule,
    HttpClientModule,
    DragDropModule,

    // Módulos da aplicação
    AppRoutingModule,
    AuthModule,
    InterceptorModule,
    SharedServicesModule,
  ],
  providers: [
    // URL base para serviços da API
    { provide: 'servicesRootUrl', useValue: 'http://localhost:3333' },
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
