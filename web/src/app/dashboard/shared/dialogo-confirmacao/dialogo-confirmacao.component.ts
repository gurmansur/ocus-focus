import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Componente para exibir diálogos de confirmação.
 * Implementa padrão de design para interações do tipo sim/não ou confirmar/cancelar.
 */
@Component({
  selector: 'app-dialogo-confirmacao',
  templateUrl: './dialogo-confirmacao.component.html',
  styleUrls: ['./dialogo-confirmacao.component.css'],
})
export class DialogoConfirmacaoComponent {
  /**
   * Título do diálogo
   */
  @Input() titulo!: string;

  /**
   * Mensagem exibida no diálogo
   */
  @Input() mensagem!: string;

  /**
   * Controla se o diálogo está visível
   */
  @Input() isActive = false;

  /**
   * Texto para o botão de confirmação
   */
  @Input() textoConfirmar = 'Confirmar';

  /**
   * Texto para o botão de cancelamento
   */
  @Input() textoCancelar = 'Cancelar';

  /**
   * Evento emitido quando o usuário confirma a ação
   */
  @Output() confirmar = new EventEmitter<void>();

  /**
   * Evento emitido quando o usuário cancela a ação
   */
  @Output() cancelar = new EventEmitter<void>();

  /**
   * Evento emitido quando o estado de visibilidade do diálogo muda
   */
  @Output() isActiveChange = new EventEmitter<boolean>();

  /**
   * Manipula a ação de confirmação
   */
  onConfirmar(): void {
    this.confirmar.emit();
    this.fechar();
  }

  /**
   * Manipula a ação de cancelamento
   */
  onCancelar(): void {
    this.cancelar.emit();
    this.fechar();
  }

  /**
   * Fecha o diálogo
   */
  fechar(): void {
    this.isActive = false;
    this.isActiveChange.emit(this.isActive);
  }

  /**
   * Abre o diálogo
   */
  abrir(): void {
    this.isActive = true;
    this.isActiveChange.emit(this.isActive);
  }
}
