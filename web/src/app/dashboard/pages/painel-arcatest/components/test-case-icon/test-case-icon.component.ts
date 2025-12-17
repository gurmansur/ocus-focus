import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-case-icon',
  standalone: true,
  imports: [],
  templateUrl: './test-case-icon.component.html',
  styleUrl: './test-case-icon.component.css',
})
export class TestCaseIconComponent {
  @Input() size?: string = '52';
  @Input() color?: string = 'currentColor';
}
