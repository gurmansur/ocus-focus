import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Tipos de botões disponíveis no sistema
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Cores de botões disponíveis no sistema
 */
export type ButtonColor = 'primary' | 'secondary' | 'danger' | 'success';

/**
 * Componente de botão compartilhado para uso em toda aplicação.
 * Implementa diferentes estilos, estados e comportamentos para botões.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  /**
   * Evento emitido quando o botão é clicado
   */
  @Output() onClick = new EventEmitter<void>();
  
  /**
   * Indica se o botão está desabilitado
   */
  @Input() disabled = false;
  
  /**
   * Indica se o botão deve mostrar estado de carregamento
   */
  @Input() loading = false;
  
  /**
   * Tipo do botão HTML (button, submit, reset)
   */
  @Input() type: ButtonType = 'button';
  
  /**
   * Cor/estilo visual do botão
   */
  @Input() color: ButtonColor = 'primary';

  /**
   * Manipula o evento de clique no botão e emite o evento para o componente pai
   */
  handleClick(): void {
    if (!this.disabled && !this.loading) {
      this.onClick.emit();
    }
  }
}
