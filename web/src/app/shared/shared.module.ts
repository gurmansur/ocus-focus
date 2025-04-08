import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Componentes standalone
import { ButtonComponent } from './button/button.component';
import { LoadingComponent } from './loading/loading.component';
import { NotificationComponent } from './notification/notification.component';

// Serviços
import { SharedServicesModule } from './services/shared-services.module';

/**
 * Módulo compartilhado que agrupa componentes, diretivas e pipes reutilizáveis
 * para toda a aplicação. Facilita a importação destes recursos em outros módulos.
 */
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Componentes standalone
    ButtonComponent,
    LoadingComponent,
    NotificationComponent,
    
    // Módulos de serviços
    SharedServicesModule,
  ],
  exports: [
    // Módulos Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    
    // Componentes standalone
    ButtonComponent,
    LoadingComponent,
    NotificationComponent,
    
    // Módulos de serviços
    SharedServicesModule,
  ]
})
export class SharedModule {} 