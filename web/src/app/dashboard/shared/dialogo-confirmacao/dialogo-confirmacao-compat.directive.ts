import { Directive, Input, OnInit, Host } from '@angular/core';
import { DialogoConfirmacaoComponent } from './dialogo-confirmacao.component';

/**
 * Diretiva de compatibilidade para manter suporte ao uso anterior
 * do DialogoConfirmacaoComponent que usava as propriedades onCancel e onConfirm
 * ao invés de eventos.
 * 
 * Esta diretiva serve como adaptador para evitar quebras em componentes
 * que usavam a versão anterior da API.
 */
@Directive({
  selector: 'app-dialogo-confirmacao',
})
export class DialogoConfirmacaoCompatDirective implements OnInit {
  /**
   * Função de callback para o evento de cancelamento
   */
  @Input() onCancel?: () => void;

  /**
   * Função de callback para o evento de confirmação
   */
  @Input() onConfirm?: () => void;

  constructor(@Host() private component: DialogoConfirmacaoComponent) {}

  /**
   * Configura os listeners para os eventos do componente DialogoConfirmacao
   * e chama os callbacks onCancel e onConfirm quando necessário
   */
  ngOnInit(): void {
    // Registra os callbacks para os eventos do componente
    this.component.cancelar.subscribe(() => {
      if (this.onCancel) {
        this.onCancel();
      }
    });

    this.component.confirmar.subscribe(() => {
      if (this.onConfirm) {
        this.onConfirm();
      }
    });
  }
}
