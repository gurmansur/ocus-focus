import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { StorageService } from '../../../shared/services/storage.service';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';

/**
 * Interface for user data stored in localStorage
 */
interface UserData {
  email: string;
  name: string;
  id: number;
  role: string;
}

/**
 * Componente de barra lateral da aplicação.
 * Exibe os projetos recentes do usuário e opções de navegação.
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  /** Flag que controla se a sidebar está expandida */
  @Input() isExpanded = false;

  /** Evento emitido quando o usuário fecha o menu */
  @Output() closeMenuClick = new EventEmitter<boolean>();

  /** Lista de projetos recentes do usuário */
  projetos: Projeto[] = [];

  /** ID do usuário logado */
  userId: number;

  /** Papel do usuário no sistema */
  userRole: string;

  /** Subject para controle de ciclo de vida de observables */
  private destroy$ = new Subject<void>();

  /** Status de carregamento */
  isLoading = false;

  /** Mensagem de erro, caso ocorra algum problema ao carregar os projetos */
  errorMessage = '';

  constructor(
    private projetoService: ProjetoService,
    private router: Router,
    private storageService: StorageService
  ) {
    // Obter o papel do usuário do localStorage
    this.userRole = this.storageService.getItem('usu_role') || '';

    // Se não encontrou o papel no formato antigo, tenta obter do objeto userData
    if (!this.userRole) {
      const userData = this.storageService.getObject<UserData>('userData');
      if (userData && userData.role) {
        this.userRole = userData.role;
      }
    }

    // Obter o ID do usuário
    const userId = this.storageService.getItem('usu_id');
    if (!userId) {
      const userData = this.storageService.getObject<UserData>('userData');
      this.userId = userData && userData.id ? Number(userData.id) : 0;
    } else {
      this.userId = Number(userId);
    }
  }

  /**
   * Inicializa o componente, carregando os projetos recentes
   */
  ngOnInit(): void {
    this.carregarProjetosRecentes();
  }

  /**
   * Realiza limpeza de recursos quando o componente é destruído
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carrega os projetos recentes do usuário
   */
  private carregarProjetosRecentes(): void {
    if (!this.userId) {
      this.errorMessage = 'ID do usuário não encontrado';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.projetoService
      .getProjetosRecentes(this.userId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          this.errorMessage = 'Erro ao carregar projetos recentes';
          console.error('Erro ao carregar projetos recentes:', err);
          this.isLoading = false;
          throw err;
        })
      )
      .subscribe({
        next: (projetos) => {
          this.projetos = projetos;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  /**
   * Emite evento quando o usuário fecha o menu
   */
  onCloseClick(val: boolean): void {
    this.closeMenuClick.emit(val);
  }

  /**
   * Navega para a página de um projeto específico
   */
  navigateToProject(id: number): void {
    this.router.navigate(['/dashboard/projeto', id]);
  }

  /**
   * Navega para a página de listagem de projetos
   */
  navigateToProjects(): void {
    this.router.navigate(['/dashboard/projetos']);
  }

  /**
   * Navega para a página inicial do dashboard
   */
  navigateToHome(): void {
    this.router.navigate(['/dashboard']);
  }

  /**
   * Tenta recarregar os projetos em caso de erro
   */
  recarregarProjetos(): void {
    this.carregarProjetosRecentes();
  }
}
