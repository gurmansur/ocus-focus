import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { ClipIconComponent } from 'src/app/shared/icons/clip-icon/clip-icon.component';

@Component({
  selector: 'app-flyingcards-task-modal',
  standalone: true,
  imports: [ContentModalComponent, CommonModule, ClipIconComponent],
  templateUrl: './flyingcards-task-modal.component.html',
  styleUrl: './flyingcards-task-modal.component.css',
})
export class FlyingcardsTaskModalComponent {
  @Input({ required: true }) open: boolean = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
