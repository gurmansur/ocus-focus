import { Component, Input } from '@angular/core';
import { CasoDeTeste } from 'src/app/dashboard/models/casoDeTeste';
import { TestCaseIconComponent } from '../../painel-arcatest/components/test-case-icon/test-case-icon.component';

@Component({
  selector: 'app-arcatest-caso',
  standalone: true,
  imports: [TestCaseIconComponent],
  templateUrl: './arcatest-caso.component.html',
  styleUrl: './arcatest-caso.component.css',
})
export class ArcatestCasoComponent {
  @Input() caso!: CasoDeTeste;
}
