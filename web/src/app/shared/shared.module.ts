import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import PrimeNG modules
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

/**
 * Shared module
 * Contains components, directives, and pipes that are reused across features
 * Also exports common Angular modules to reduce imports in feature modules
 *
 * Follows Angular best practices:
 * - Only declare presentational components (dumb components)
 * - Re-export common modules to reduce duplication
 * - Keep module lean and focused on shared functionality
 */
@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    // Common modules
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // PrimeNG modules
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
    DialogModule,
    ToolbarModule,
    TableModule,
    ConfirmDialogModule,
  ],
})
export class SharedModule {}
