import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Output() onClick = new EventEmitter<void>();
  @Input() disabled: boolean = false;

  handleClick() {
    this.onClick.emit();
  }
}
