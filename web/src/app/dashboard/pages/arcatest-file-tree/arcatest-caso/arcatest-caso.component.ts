import { Component, Input } from '@angular/core';
import { CasoDeTeste } from 'src/app/dashboard/models/casoDeTeste';

@Component({
  selector: 'app-arcatest-caso',
  standalone: true,
  imports: [],
  templateUrl: './arcatest-caso.component.html',
  styleUrl: './arcatest-caso.component.css',
})
export class ArcatestCasoComponent {
  @Input() caso!: CasoDeTeste;
}
