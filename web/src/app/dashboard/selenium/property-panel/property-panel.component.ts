import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NodeDeTeste,
  TipoAcao,
  TipoSeletor,
} from '../../../shared/models/test-flow.models';

@Component({
  selector: 'app-property-panel',
  templateUrl: './property-panel.component.html',
  styleUrls: ['./property-panel.component.css'],
})
export class PropertyPanelComponent {
  @Input() node?: NodeDeTeste | null;
  @Output() save = new EventEmitter<NodeDeTeste>();
  tiposAcao: TipoAcao[] = [
    'NAVEGAR',
    'CLICAR',
    'DIGITAR',
    'SELECIONAR',
    'ESPERAR',
    'VALIDAR_TEXTO',
    'VALIDAR_ELEMENTO',
    'SCREENSHOT',
    'EXECUTAR_SCRIPT',
    'SCROLL',
    'HOVER',
    'DUPLO_CLIQUE',
    'CLICAR_DIREITO',
    'LIMPAR_CAMPO',
    'PRESSIONAR_TECLA',
    'UPLOAD_ARQUIVO',
    'TROCAR_JANELA',
    'TROCAR_FRAME',
    'ACEITAR_ALERTA',
    'REJEITAR_ALERTA',
    'OBTER_TEXTO_ALERTA',
  ];
  tiposSeletor: TipoSeletor[] = [
    'ID',
    'CLASS',
    'CSS',
    'XPATH',
    'NAME',
    'TAG',
    'LINK_TEXT',
  ];

  onSave() {
    if (this.node) this.save.emit(this.node);
  }
}
