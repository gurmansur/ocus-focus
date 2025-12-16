import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestExecutionModalComponent implements OnChanges {
  @Input() showModal = false;
  @Input() executando = false;
  @Input() log: LogEntry[] = [];
  @Output() close = new EventEmitter<void>();

  enlargedImage: string | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['log'] || changes['executando'] || changes['showModal']) {
      this.cdr.markForCheck();
    }
  }

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
