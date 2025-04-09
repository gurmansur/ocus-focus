import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Colaborador } from '../../models/colaborador';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';

@Component({
  selector: 'app-colaboradores-projeto',
  templateUrl: './colaboradores-projeto.component.html',
  styleUrls: ['./colaboradores-projeto.component.css'],
})
export class ColaboradoresProjetoComponent implements OnInit {
  userId: number = 0;
  projetoId!: number;
  projeto!: Projeto;

  constructor(
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.projetoId = this.route.snapshot.params['id'];

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

  // datasource
  colaboradores: Colaborador[] = [];

  // tabela
  colunasTabela: string[] = ['Nome', 'Email', 'Cargo'];

  camposEntidade: string[] = ['nome', 'email', 'cargo'];

  // formulario de busca
  filterValue: string = '';

  // paginação
  paginaAtual: number = 0;
  tamanhoPagina: number = 10;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  // metrics
  quantidadeProjetos: number = 0;
  novosProjetos: number = 0;
  projetosEmAndamento: number = 0;
  projetosConcluidos: number = 0;

  // diálogo de confirmação
  showModal: boolean = false;
  mostrarDialogoConfirmacao: boolean = false;
  itemExclusao!: number;
  tituloDialogo: string = 'Deseja realmente excluir este colaborador?';
  mensagemDialogo: string =
    'Essa ação é irreversível. Todos os dados do colaborador em questão serão excluídos do sistema.';

  ngOnInit() {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }

    this.buscarProjeto(this.projetoId, this.userId);
    this.executarBusca();
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

  onSubmitSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.executarBusca();
  }

  private executarBusca(): void {
    if (!this.filterValue) {
      this.projetoService
        .getColaboradoresByProjeto(
          this.projetoId,
          this.paginaAtual,
          this.tamanhoPagina
        )
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar colaboradores:', err);
          },
        });
    } else {
      this.projetoService
        .getColaboradoresByProjetoAndNome(
          this.projetoId,
          this.filterValue,
          this.paginaAtual,
          this.tamanhoPagina
        )
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar colaboradores por nome:', err);
          },
        });
    }
  }

  private processarResultado() {
    return (data: any) => {
      this.colaboradores = data.items;
      this.paginaAtual = data.page.number;
      this.tamanhoPagina = data.page.size;
      this.quantidadeElementos = data.page.totalElements;
      this.totalPaginas = data.page.totalPages;
    };
  }

  backToProjectHome() {
    this.router.navigate(['/dashboard/projeto/', this.projetoId]);
  }

  openNewColaborador() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projetoId,
      'inserir-colaborador',
    ]);
  }

  excluirItem(item: any) {
    this.itemExclusao = item.id;
    this.showModal = true;
    this.mostrarDialogoConfirmacao = true;
  }

  cancelarExclusao() {
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;
  }

  confirmarExclusao() {
    this.projetoService
      .removeColaborador(this.projetoId, this.itemExclusao)
      .subscribe({
        next: () => {
          this.showModal = false;
          this.mostrarDialogoConfirmacao = false;
          this.executarBusca();
        },
        error: (err) => {
          console.error('Erro ao remover colaborador:', err);
          this.showModal = false;
          this.mostrarDialogoConfirmacao = false;
        },
      });
  }

  prevPage() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.executarBusca();
    }
  }

  nextPage() {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.executarBusca();
    }
  }
}
