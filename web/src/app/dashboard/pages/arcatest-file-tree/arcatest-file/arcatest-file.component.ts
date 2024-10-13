import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SuiteDeTeste } from 'src/app/dashboard/models/suiteDeTeste';
import { TestSuiteIconComponent } from '../../painel-arcatest/components/test-suite-icon/test-suite-icon.component';
import { ArcatestCasoComponent } from '../arcatest-caso/arcatest-caso.component';

@Component({
  selector: 'app-arcatest-file',
  standalone: true,
  imports: [ArcatestCasoComponent, CommonModule, TestSuiteIconComponent],
  templateUrl: './arcatest-file.component.html',
  styleUrl: './arcatest-file.component.css',
})
export class ArcatestFileComponent {
  @Input() file!: SuiteDeTeste;
  @Input() level: number = 0;
}
