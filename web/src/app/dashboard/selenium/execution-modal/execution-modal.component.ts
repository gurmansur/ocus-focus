import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-execution-modal',
  templateUrl: './execution-modal.component.html',
  styleUrls: ['./execution-modal.component.css'],
})
export class ExecutionModalComponent {
  @Input() open = false;
  @Input() logs: string[] = [];
  @Input() loading = false;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
