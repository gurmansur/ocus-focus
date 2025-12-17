import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-suite-icon',
  standalone: true,
  imports: [],
  templateUrl: './test-suite-icon.component.html',
  styleUrl: './test-suite-icon.component.css',
})
export class TestSuiteIconComponent {
  @Input() size?: string = '52';
  @Input() color?: string = 'currentColor';
}
