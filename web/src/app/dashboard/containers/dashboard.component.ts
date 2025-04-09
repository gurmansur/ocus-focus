import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../shared/services/storage.service';
import { AuthService } from '../../auth/services/auth.service';

/**
 * Componente principal do dashboard que gerencia o layout 
 * e o estado do menu lateral.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  /**
   * Indica se o menu lateral está expandido ou não
   */
  sidebarExpanded = true;
  
  /**
   * Indica se está carregando
   */
  isLoading = true;

  /**
   * Construtor do componente
   * @param storageService Serviço para gerenciamento de armazenamento local
   * @param authService Serviço de autenticação
   * @param router Router para navegação
   */
  constructor(
    private storageService: StorageService,
    private authService: AuthService, 
    private router: Router
  ) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    try {
      // Verifica se o usuário está autenticado
      if (!this.authService.hasValidToken()) {
        this.router.navigateByUrl('/');
        return;
      }
      
      // Recupera o estado anterior do menu do serviço de armazenamento
      this.sidebarExpanded = this.storageService.getSidebarState();
      this.isLoading = false;
    } catch (error) {
      console.error('Erro ao inicializar o dashboard:', error);
      this.isLoading = false;
      // Redirecionar para a página inicial em caso de erro
      this.router.navigateByUrl('/');
    }
  }

  /**
   * Alterna o estado de expansão do menu lateral
   * e salva esse estado para persistência entre sessões
   */
  onMenuClick(): void {
    try {
      this.sidebarExpanded = !this.sidebarExpanded;
      this.storageService.setSidebarState(this.sidebarExpanded);
    } catch (error) {
      console.error('Erro ao alterar o estado do menu:', error);
    }
  }
}
