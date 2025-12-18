import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { UserStory } from '../../models/userStory';
import { UserStoryService } from '../../services/user-story.service';

@Component({
  selector: 'app-flyingcards-userstory',
  standalone: true,
  imports: [CommonModule, ContentModalComponent],
  templateUrl: './flyingcards-userstory.component.html',
  styleUrl: './flyingcards-userstory.component.css',
})
export class FlyingcardsUserstoryComponent implements OnChanges {
  @Input() open = false;
  @Input() userStory: UserStory | null = null;
  @Input() requirements: any[] = [];
  @Input() projectId!: number;

  linkedCasos: any[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  constructor(private readonly userStoryService: UserStoryService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userStory'] && this.userStory?.id) {
      this.loadCasos();
    }
  }

  private loadCasos(): void {
    if (!this.userStory?.id) return;

    this.userStoryService.getCasosUso(this.userStory.id).subscribe({
      next: (casos) => {
        this.linkedCasos = casos || [];
      },
    });
  }

  onClose() {
    this.close.emit();
  }

  onConfirm() {
    this.confirm.emit();
  }

  onEdit() {
    this.editClick.emit();
  }

  onDelete() {
    this.deleteClick.emit();
  }
}
