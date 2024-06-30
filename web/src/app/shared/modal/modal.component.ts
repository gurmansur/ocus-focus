import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input({ required: true }) open: boolean = false;
  @Input() confirmText: string = 'Confirmar';
  @Input() cancelText: string = 'Cancelar';
  @Input() showCancel: boolean = true;
  @Input() showConfirm: boolean = true;
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
