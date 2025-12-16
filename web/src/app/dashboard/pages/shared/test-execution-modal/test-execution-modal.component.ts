import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface LogEntry {
  type: 'text' | 'image';
  content: string;
}

@Component({
  selector: 'app-test-execution-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-execution-modal.component.html',
  styleUrl: './test-execution-modal.component.css',
})
export class TestExecutionModalComponent {
  @Input() showModal = false;
  @Input() executando = false;
  @Input() log: LogEntry[] = [];
  @Output() close = new EventEmitter<void>();

  enlargedImage: string | null = null;

  fecharModal() {
    if (!this.executando) {
      this.close.emit();
    }
  }

  openImage(src: string) {
    this.enlargedImage = src;
  }

  closeImage() {
    this.enlargedImage = null;
  }
}
