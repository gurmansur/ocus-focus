import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-content-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './content-modal.component.html',
  styleUrl: './content-modal.component.css',
})
export class ContentModalComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) open: boolean = false;
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() showCancel: boolean = false;
  @Input() showConfirm: boolean = true;
  @Input() widthClass: string = 'sm:max-w-2xl';
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  stopPropagation($event: MouseEvent) {
    $event.stopPropagation();
  }

  onClose() {
    this.close.emit();
  }
}
