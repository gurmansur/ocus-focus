import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input({ required: true }) data!: any[];
  @Input({ required: true }) entityAttributes!: string[];
  @Input({ required: true }) columns!: string[];
  @Input() hasUseCase?: boolean = false;
  @Input() hasAlert?: boolean = false;
  @Input() hasView?: boolean = false;
  @Input() hasEdit: boolean = true;
  @Input() hasDelete: boolean = true;
  @Input() onUseCase: (item: any) => void = () => {};
  @Input() onAlert: (item: any) => void = () => {};
  @Input() onEdit: (item: any) => void = () => {};
  @Input() onDelete: (item: any) => void = () => {};
  @Input() onView: (item: any) => void = () => {};
  @Input({ required: true }) customEmptyMessage!: string;
}
