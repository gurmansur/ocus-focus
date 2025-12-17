import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-test-plan-icon',
  standalone: true,
  imports: [],
  templateUrl: './test-plan-icon.component.html',
  styleUrl: './test-plan-icon.component.css',
})
export class TestPlanIconComponent {
  @Input() size?: string = '52';
  @Input() color?: string = 'currentColor';
}
