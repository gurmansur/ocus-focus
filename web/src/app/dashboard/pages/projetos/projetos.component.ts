import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.css'],
})
export class ProjetosComponent implements OnInit {
  constructor(
    private projetoService: ProjetoService, 
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  userId: number = 0;

  // datasource
  projetos: Projeto[] = [];

  // tabela
  colunasTabela: string[] = [
    'Nome',
    'Descrição',
    'Data de Início',
    'Data de Término',
    'Status',
  ];

  camposEntidade: string[] = [
    'nome',
    'descricao',
    'dataInicio',
    'previsaoFim',
    'status',
  ];

  // formulario de busca
  filterValue: string = '';

  // paginação
  paginaAtual: number = 0;
  tamanhoPagina: number = 5;
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
  tituloDialogo: string = 'Deseja realmente excluir este projeto?';
  mensagemDialogo: string =
    'Essa ação é irreversível. Todos os dados do projeto em questão serão excluídos do sistema.';

  ngOnInit() {
    // Obter o ID do usuário a partir dos dados do usuário
    const userData = this.authService.getUserData();
    
    if (userData && userData.id) {
      this.userId = Number(userData.id);
    } else {
      // Fallback para o StorageService
      const storedId = this.storageService.getItem('usu_id');
      this.userId = storedId ? Number(storedId) : 0;
    }
    
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      // Redirecionar para login se o ID não for encontrado
      this.router.navigate(['/']);
      return;
    }
    
    this.executarBusca();
    this.buscarMetricas();
  }

  onSubmitSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.executarBusca();
  }

  private executarBusca(): void {
    this.projetoService
      .findByNome(
        this.userId,
        this.filterValue,
        this.paginaAtual,
        this.tamanhoPagina
      )
      .subscribe({
        next: this.processarResultado(),
        error: (err) => {
          console.error('Erro ao buscar projetos:', err);
        }
      });

    this.buscarMetricas();
  }

  private buscarMetricas(): void {
    this.projetoService.getNumberOfProjetos(this.userId).subscribe({
      next: (data) => {
        this.quantidadeProjetos = data.totalCount;
      },
      error: (err) => {
        console.error('Erro ao buscar quantidade de projetos:', err);
      }
    });

    this.projetoService
      .getNumberOfNovosProjetos(this.userId)
      .subscribe({
        next: (data) => {
          this.novosProjetos = data.totalCount;
        },
        error: (err) => {
          console.error('Erro ao buscar projetos novos:', err);
        }
      });

    this.projetoService
      .getNumberOfProjetosEmAndamento(this.userId)
      .subscribe({
        next: (data) => {
          this.projetosEmAndamento = data.totalCount;
        },
        error: (err) => {
          console.error('Erro ao buscar projetos em andamento:', err);
        }
      });

    this.projetoService
      .getNumberOfProjetosConcluidos(this.userId)
      .subscribe({
        next: (data) => {
          this.projetosConcluidos = data.totalCount;
        },
        error: (err) => {
          console.error('Erro ao buscar projetos concluídos:', err);
        }
      });
  }

  private processarResultado() {
    return (data: any) => {
      this.projetos = data.items;
      this.paginaAtual = data.page.number;
      this.tamanhoPagina = data.page.size;
      this.quantidadeElementos = data.page.totalElements;
      this.totalPaginas = data.page.totalPages;
    };
  }

  visualizarItem(item: any) {
    this.storageService.setItem('projeto_id', item.id);
    this.router.navigate(['/dashboard/projeto/', item.id]);
  }

  editarItem(item: any) {
    this.router.navigate(['/dashboard/editar-projeto/', item.id]);
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
    this.projetoService.delete(this.itemExclusao).subscribe({
      next: () => {
        this.showModal = false;
        this.mostrarDialogoConfirmacao = false;
        this.executarBusca();
      },
      error: (err) => {
        console.error('Erro ao excluir projeto:', err);
        this.showModal = false;
        this.mostrarDialogoConfirmacao = false;
      }
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
