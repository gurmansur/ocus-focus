import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeDeTeste } from '../../../shared/models/test-flow.models';

@Component({
  selector: 'app-node-canvas',
  templateUrl: './node-canvas.component.html',
  styleUrls: ['./node-canvas.component.css'],
})
export class NodeCanvasComponent {
  @Input() nodes: NodeDeTeste[] = [];
  @Output() selectNode = new EventEmitter<NodeDeTeste>();
  @Output() addNode = new EventEmitter<void>();
  @Output() removeNode = new EventEmitter<string>();

  onSelect(node: NodeDeTeste) {
    this.selectNode.emit(node);
  }
}
