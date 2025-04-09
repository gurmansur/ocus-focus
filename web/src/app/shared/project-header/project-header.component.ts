import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Projeto } from 'src/app/dashboard/models/projeto';
import { ProjetoService } from 'src/app/dashboard/services/projeto.service';
import { StorageService } from 'src/app/shared/services/storage.service';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [],
  templateUrl: './project-header.component.html',
  styleUrl: './project-header.component.css',
})
export class ProjectHeaderComponent {
  userId: number = 0;
  projectId!: number;
  projeto!: Projeto;
  @Input() voltar = 'Voltar ao Início';
  @Output() onBack = new EventEmitter<void>();

  constructor(
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.projectId = this.route.snapshot.params['id'];

    // Get user ID from AuthService or StorageService as fallback
    const userData = this.authService.getUserData();
    if (userData && userData.id) {
      this.userId = Number(userData.id);
    } else {
      // Fallback to StorageService
      const storedId = this.storageService.getItem('usu_id');
      this.userId = storedId ? Number(storedId) : 0;
    }
  }

  ngOnInit() {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }
    this.buscarProjeto(this.projectId, this.userId);
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe({
      next: (projeto) => {
        this.projeto = projeto;
      },
      error: (err) => {
        console.error('Erro ao buscar projeto:', err);
      },
    });
  }

  openProjectHome() {
    this.onBack.emit();
  }

  openAtores() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'atores']);
  }
}
