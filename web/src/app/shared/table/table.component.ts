import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input() hasExecute?: boolean = false;
  @Input() hasEdit: boolean = true;
  @Input() hasDelete: boolean = true;
  @Output() useCaseClick = new EventEmitter<number>();
  @Output() alertClick = new EventEmitter<number>();
  @Output() viewClick = new EventEmitter<number>();
  @Output() editClick = new EventEmitter<number>();
  @Output() executeClick = new EventEmitter<number>();
  @Output() deleteClick = new EventEmitter<number>();
  @Input({ required: true }) customEmptyMessage!: string;

  useCaseClicked(id: number) {
    this.useCaseClick.emit(id);
  }

  alertClicked(id: number) {
    this.alertClick.emit(id);
  }

  viewClicked(id: number) {
    this.viewClick.emit(id);
  }

  editClicked(id: number) {
    this.editClick.emit(id);
  }

  deleteClicked(id: number) {
    this.deleteClick.emit(id);
  }

  executeClicked(id: number) {
    this.executeClick.emit(id);
  }

  getEntityAttribute = (entity: any, attribute: string): string => {
    const attributes = attribute.split(':');
    let value = entity;

    for (const attr of attributes) {
      value = value ? value[attr] : '-';
    }

    return value || '-';
  };
}
