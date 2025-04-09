import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Projeto } from '../../models/projeto';
import { Stakeholder } from '../../models/stakeholder';
import { ProjetoService } from '../../services/projeto.service';
import { StakeholderService } from '../../services/stakeholder.service';

@Component({
  selector: 'app-stakeholders-projeto',
  templateUrl: './stakeholders-projeto.component.html',
  styleUrls: ['./stakeholders-projeto.component.css'],
})
export class StakeholdersProjetoComponent implements OnInit {
  userId: number = 0;
  projetoId!: number;
  projeto!: Projeto;

  constructor(
    private projetoService: ProjetoService,
    private stakeholderService: StakeholderService,
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
  stakeholders: Stakeholder[] = [];

  // tabela
  colunasTabela: string[] = ['Nome', 'Cargo', 'Participação', 'Alerta'];

  camposEntidade: string[] = [
    'nome',
    'cargo',
    'participacaoRealizada',
    'alertaEmitido',
  ];

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
  tituloDialogo: string = "Deseja realmente excluir este stakeholder?";
  mensagemDialogo: string = "Essa ação é irreversível. Todos os dados do stakeholder em questão serão excluídos do sistema.";

  // diálogo de confirmação alerta
  showAlertModal: boolean = false;
  itemAlerta!: number;
  tituloDialogoAlerta: string = 'Deseja realmente alertar o stakeholder?';
  mensagemDialogoAlerta: string =
    'O Stakeholder receberá um alerta pedindo a sua participação no processo de priorização.';

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
      }
    });
  }

  onSubmitSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.executarBusca();
  }

  private executarBusca(): void {
    if (!this.filterValue) {
      this.stakeholderService
        .listByProjeto(this.projetoId, this.paginaAtual, this.tamanhoPagina)
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar stakeholders:', err);
          }
        });
    } else {
      this.stakeholderService
        .listByName(
          this.projetoId,
          this.filterValue,
          this.paginaAtual,
          this.tamanhoPagina
        )
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar stakeholders por nome:', err);
          }
        });
    }
  }

  private processarResultado() {
    return (data: any) => {
      this.stakeholders = data.items;
      this.paginaAtual = data.page.number;
      this.tamanhoPagina = data.page.size;
      this.quantidadeElementos = data.page.totalElements;
      this.totalPaginas = data.page.totalPages;
    };
  }

  backToPrioreasy() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projetoId,
      'painel-prioreasy',
    ]);
  }

  openNewStakeholder() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projetoId,
      'inserir-stakeholder',
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
    this.stakeholderService.delete(this.itemExclusao).subscribe({
      next: () => {
        this.showModal = false;
        this.mostrarDialogoConfirmacao = false;
        this.executarBusca();
      },
      error: (err) => {
        console.error('Erro ao excluir stakeholder:', err);
        this.showModal = false;
        this.mostrarDialogoConfirmacao = false;
      }
    });
  }

  alertarItem(item: any) {
    this.itemAlerta = item.id;
    this.showAlertModal = true;
  }

  cancelarAlerta() {
    this.showAlertModal = false;
  }

  confirmarAlerta() {
    this.stakeholderService.alert(this.itemAlerta).subscribe({
      next: () => {
        this.showAlertModal = false;
        this.executarBusca();
      },
      error: (err) => {
        console.error('Erro ao alertar stakeholder:', err);
        this.showAlertModal = false;
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
