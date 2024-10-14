import { Component, Input } from '@angular/core';
import { LegendPosition, PieChartModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [PieChartModule],
  templateUrl: './pie-chart.component.html',
  styleUrl: './pie-chart.component.css',
})
export class PieChartComponent {
  legendPosition: LegendPosition = LegendPosition.Below;
  @Input({ required: true }) passed!: { value: number; percentage: number };
  @Input({ required: true }) failed!: { value: number; percentage: number };
  @Input({ required: true }) pending!: { value: number; percentage: number };
}
