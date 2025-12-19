import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  Notificacao,
  NotificacaoService,
} from '../../services/notificacao.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() sidebarExpanded!: boolean;
  @Output() menuClick = new EventEmitter<boolean>();

  onMenuClick(val: boolean) {
    this.menuClick.emit(val);
  }

  username!: string;
  usuarioId!: number;
  notifications: Notificacao[] = [];
  unreadCount = 0;
  showNotif = false;

  constructor(
    private router: Router,
    private notificacaoService: NotificacaoService,
  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('usu_name')!;
    this.usuarioId = Number(localStorage.getItem('usu_id'));
    if (this.usuarioId) {
      this.loadNotifications();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usu_id');
    localStorage.removeItem('usu_name');
    localStorage.removeItem('usu_email');
    this.router.navigate(['/']);
  }

  toggleNotifications() {
    this.showNotif = !this.showNotif;
  }

  loadNotifications() {
    this.notificacaoService.list(this.usuarioId).subscribe((items) => {
      this.notifications = items || [];
      this.unreadCount = (this.notifications || []).filter(
        (n) => !n.lido,
      ).length;
    });
  }

  private navigateToUserStory(n: Notificacao) {
    if (!n.projetoId || !n.userStoryId) return;
    this.showNotif = false;
    this.router.navigate(['/dashboard/projeto', n.projetoId, 'kanban'], {
      queryParams: { usId: n.userStoryId },
    });
  }

  private updateUnreadCount() {
    this.unreadCount = (this.notifications || []).filter((i) => !i.lido).length;
  }

  onNotificationClick(n: Notificacao) {
    if (!n.lido) {
      this.notificacaoService.markRead(n.id).subscribe({
        next: () => {
          n.lido = true;
          this.updateUnreadCount();
          this.navigateToUserStory(n);
        },
        error: () => this.navigateToUserStory(n),
      });
    } else {
      this.navigateToUserStory(n);
    }
  }
}
