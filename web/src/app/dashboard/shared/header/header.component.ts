import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() sidebarExpanded!: boolean;
  @Output() menuClick = new EventEmitter<boolean>();

  onMenuClick(val: boolean) {
    this.menuClick.emit(val);
  }

  username: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    // Obtém os dados do usuário do AuthService ou do StorageService como fallback
    const userData = this.authService.getUserData();
    if (userData && userData.name) {
      this.username = userData.name;
    } else {
      // Fallback para o StorageService
      this.username = this.storageService.getItem('usu_name') || 'Usuário';
    }
  }

  logout() {
    // Usa o método de logout do AuthService
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
