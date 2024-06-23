import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-execution-icon',
  standalone: true,
  imports: [],
  templateUrl: './execution-icon.component.html',
  styleUrl: './execution-icon.component.css',
})
export class ExecutionIconComponent {
  @Input() size?: string = '52';
  @Input() color?: string = 'currentColor';
}
