import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ErrorHandlerService } from './error-handler.service';
import { StorageService } from './storage.service';

/**
 * Módulo responsável por agrupar e fornecer os serviços compartilhados
 * para toda a aplicação.
 *
 * Facilita a importação destes serviços em outros módulos.
 */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [StorageService, ErrorHandlerService],
})
export class SharedServicesModule {}
