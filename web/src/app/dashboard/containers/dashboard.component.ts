import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';

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
   * Construtor do componente
   * @param storageService Serviço para gerenciamento de armazenamento local
   */
  constructor(private storageService: StorageService) {}

  /**
   * Inicializa o componente
   */
  ngOnInit(): void {
    // Recupera o estado anterior do menu do serviço de armazenamento
    this.sidebarExpanded = this.storageService.getSidebarState();
  }

  /**
   * Alterna o estado de expansão do menu lateral
   * e salva esse estado para persistência entre sessões
   */
  onMenuClick(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
    this.storageService.setSidebarState(this.sidebarExpanded);
  }
}
