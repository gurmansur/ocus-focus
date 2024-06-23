import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-clickable-card',
  standalone: true,
  imports: [],
  templateUrl: './clickable-card.component.html',
  styleUrl: './clickable-card.component.css',
})
export class ClickableCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) subtitle!: string;
  @Output() click = new EventEmitter<void>();

  constructor() {}

  onClick() {
    this.click.emit();
  }
}
