import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { UserStory } from '../../models/userStory';
import { ComentarioService } from '../../services/comentario.service';
import { UserStoryService } from '../../services/user-story.service';

@Component({
  selector: 'app-flyingcards-userstory',
  standalone: true,
  imports: [CommonModule, ContentModalComponent, FormsModule],
  templateUrl: './flyingcards-userstory.component.html',
  styleUrl: './flyingcards-userstory.component.css',
})
export class FlyingcardsUserstoryComponent implements OnChanges {
  @Input() open = false;
  @Input() userStory: UserStory | null = null;
  @Input() requirements: any[] = [];
  @Input() projectId!: number;

  linkedCasos: any[] = [];
  comentarios: any[] = [];
  novoComentario = '';
  loadingComentarios = false;
  // Mentions
  mentionables: { usuarioId: number; nome: string }[] = [];
  showMentionList = false;
  mentionQuery = '';
  mentionStart = -1;
  filteredMentionables: { usuarioId: number; nome: string }[] = [];
  pendingMentionUsuarioIds: number[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();
  @Output() deleteClick = new EventEmitter<void>();

  constructor(
    private readonly userStoryService: UserStoryService,
    private readonly comentarioService: ComentarioService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userStory'] && this.userStory?.id) {
      this.loadCasos();
      this.loadComentarios();
      if (this.projectId) {
        this.loadMentionables();
      }
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

  private loadComentarios(): void {
    if (!this.userStory?.id) return;
    this.loadingComentarios = true;

    this.comentarioService.getComentarios(this.userStory.id).subscribe({
      next: (comentarios) => {
        this.comentarios = comentarios || [];
        this.loadingComentarios = false;
      },
      error: () => {
        this.loadingComentarios = false;
      },
    });
  }

  private loadMentionables(): void {
    if (!this.projectId) return;
    this.userStoryService.getMentionables(this.projectId).subscribe({
      next: (items) => {
        // Only keep fields we use here
        this.mentionables = (items || []).map((i) => ({
          usuarioId: i.usuarioId,
          nome: i.nome,
        }));
        this.filteredMentionables = this.mentionables;
      },
    });
  }

  addComentario(): void {
    if (!this.userStory?.id || !this.novoComentario.trim()) return;

    const usuarioId = Number(localStorage.getItem('usu_id'));
    if (!usuarioId) return;

    // If the user typed @names but did not click the dropdown, try to resolve mentions from the text
    if (this.pendingMentionUsuarioIds.length === 0) {
      this.pendingMentionUsuarioIds = this.extractMentionIdsFromText(
        this.novoComentario,
      );
    }

    this.comentarioService
      .createComentario(
        this.userStory.id,
        this.novoComentario,
        usuarioId,
        this.pendingMentionUsuarioIds,
      )
      .subscribe({
        next: () => {
          this.novoComentario = '';
          this.pendingMentionUsuarioIds = [];
          this.hideMentionList();
          this.loadComentarios();
        },
      });
  }

  deleteComentario(comentarioId: number): void {
    this.comentarioService.deleteComentario(comentarioId).subscribe({
      next: () => {
        this.loadComentarios();
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

  onCommentKeyup(ev: KeyboardEvent, textarea: HTMLTextAreaElement) {
    const cursor = textarea.selectionStart || 0;
    const text = this.novoComentario;
    const uptoCursor = text.substring(0, cursor);
    const atIndex = uptoCursor.lastIndexOf('@');
    if (atIndex >= 0) {
      const afterAt = uptoCursor.substring(atIndex + 1);
      if (/^[^\s@]*$/.test(afterAt)) {
        this.mentionStart = atIndex;
        this.mentionQuery = afterAt.toLowerCase();
        this.filteredMentionables = this.mentionables.filter((m) =>
          m.nome.toLowerCase().includes(this.mentionQuery),
        );
        this.showMentionList = this.filteredMentionables.length > 0;
        return;
      }
    }
    this.hideMentionList();
  }

  selectMention(
    m: { usuarioId: number; nome: string },
    textarea: HTMLTextAreaElement,
  ) {
    if (this.mentionStart < 0) return;
    const cursor = textarea.selectionStart || 0;
    const before = this.novoComentario.substring(0, this.mentionStart);
    const after = this.novoComentario.substring(cursor);
    const insert = `@${m.nome} `;
    this.novoComentario = before + insert + after;
    if (!this.pendingMentionUsuarioIds.includes(m.usuarioId)) {
      this.pendingMentionUsuarioIds.push(m.usuarioId);
    }
    this.hideMentionList();
    setTimeout(() => {
      const pos = (before + insert).length;
      textarea.setSelectionRange(pos, pos);
      textarea.focus();
    });
  }

  hideMentionList() {
    this.showMentionList = false;
    this.mentionStart = -1;
    this.mentionQuery = '';
  }

  private extractMentionIdsFromText(text: string): number[] {
    const lower = text.toLowerCase();
    const ids: number[] = [];
    this.mentionables.forEach((m) => {
      const needle = `@${m.nome.toLowerCase()}`;
      if (lower.includes(needle) && !ids.includes(m.usuarioId)) {
        ids.push(m.usuarioId);
      }
    });
    return ids;
  }
}
