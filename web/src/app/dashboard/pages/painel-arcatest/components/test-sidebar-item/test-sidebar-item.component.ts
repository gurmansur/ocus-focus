import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TooltipComponent } from 'src/app/dashboard/shared/tooltip/tooltip.component';

@Component({
  standalone: true,
  selector: 'app-test-sidebar-item',
  templateUrl: './test-sidebar-item.component.html',
  styleUrls: ['./test-sidebar-item.component.css'],
  imports: [CommonModule, TooltipComponent],
})
export class TestSidebarItemComponent {
  @Input() isActive!: boolean;
  @Input() isExpanded: boolean = true;
  @Input() text!: string;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

  handleClick(): void {
    this.onClick.emit();
  }
}
