import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';

@Component({
  selector: 'app-projeto',
  templateUrl: './projeto.component.html',
  styleUrls: ['./projeto.component.css'],
})
export class ProjetoComponent implements OnInit {
  userId: number = 0;
  projectId!: number;
  projeto!: Projeto;

  showModal: boolean = false;
  mostrarDialogoConfirmacao: boolean = false;
  itemExclusao!: number;
  tituloDialogo: string = 'Deseja realmente excluir este projeto?';
  mensagemDialogo: string =
    'Essa ação é irreversível. Todos os dados do projeto em questão serão excluídos do sistema.';

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

  openColaboradores() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'colaboradores',
    ]);
  }

  openRequisitos() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'requisitos']);
  }

  openArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
      'execucoes',
    ]);
  }

  onEdit() {
    this.router.navigate(['/dashboard/editar-projeto/', this.projectId]);
  }

  excluirProjeto() {
    this.showModal = true;
    this.mostrarDialogoConfirmacao = true;
  }

  cancelarExclusao() {
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;
  }

  confirmarExclusao() {
    this.projetoService.delete(this.projectId).subscribe({
      next: () => {
        this.showModal = false;
        this.mostrarDialogoConfirmacao = false;
        this.router.navigate(['/dashboard/projetos']);
      },
      error: (err) => {
        console.error('Erro ao excluir projeto:', err);
        this.showModal = false;
        this.mostrarDialogoConfirmacao = false;
      },
    });
  }
}
