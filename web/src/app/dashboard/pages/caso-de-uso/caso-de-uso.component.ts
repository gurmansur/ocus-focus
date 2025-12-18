import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExecucaoDeTesteService } from '../../../shared/services/execucao-de-teste.service';
import { casoUso } from '../../models/casoUso';
import { Projeto } from '../../models/projeto';
import { CasoUsoService } from '../../services/casoUso.service';
import { ProjetoService } from '../../services/projeto.service';
import { LogEntry } from '../shared/test-execution-modal/test-execution-modal.component';

@Component({
  selector: 'app-caso-de-uso',
  templateUrl: './caso-de-uso.component.html',
  styleUrls: ['./caso-de-uso.component.css'],
})
export class CasoDeUsoComponent {
  userId!: number;
  requisitoId!: number;
  projetoId!: number;
  projeto!: Projeto;

  constructor(
    private projetoService: ProjetoService,
    private casoUsoService: CasoUsoService,
    private router: Router,
    private route: ActivatedRoute,
    private automationService: ExecucaoDeTesteService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.projetoId = this.route.snapshot.params['idPro'];
    this.requisitoId = this.route.snapshot.params['id'];
    this.userId = Number(localStorage.getItem('usu_id'));
  }

  // datasource
  caso: casoUso[] = [];

  // tabela
  colunasTabela: string[] = ['Nome', 'Complexidade', 'Descrição', 'Cenários'];

  camposEntidade: string[] = ['nome', 'complexidade', 'descricao'];

  // formulario de busca
  filterValue: string = '';

  // paginação
  paginaAtual: number = 0;
  tamanhoPagina: number = 5;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  // metrics

  totalCasos: number = 0;
  casosSimples: number = 0;
  casosMedios: number = 0;
  casosComplexos: number = 0;

  // diálogo de confirmação
  showModal: boolean = false;
  itemExclusao!: number;
  tituloDialogo: string = 'Deseja realmente excluir este caso de uso?';
  mensagemDialogo: string =
    'Essa ação é irreversível. Todos os dados do caso de uso em questão serão excluídos do sistema.';

  // Automated execution state
  showAutomationModal = false;
  executando = false;
  log: LogEntry[] = [];
  private executionSub?: Subscription;

  ngOnInit() {
    this.buscarProjeto(this.projetoId, this.userId);
    this.executarBusca();
    this.buscarMetricas();
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe((projeto) => {
      this.projeto = projeto;
    });
  }

  onSubmitSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.executarBusca();
  }

  private executarBusca(): void {
    if (!this.filterValue) {
      this.casoUsoService
        .list(
          this.projetoId,
          this.requisitoId,
          this.paginaAtual,
          this.tamanhoPagina,
        )
        .subscribe(this.processarResultado());
    } else {
      this.casoUsoService
        .listByName(
          this.requisitoId,
          this.filterValue,
          this.paginaAtual,
          this.tamanhoPagina,
        )
        .subscribe(this.processarResultado());
    }
  }

  backToProjectHome() {
    this.router.navigate(['dashboard/projeto/', this.projetoId, 'requisitos']);
  }

  openNewCaso() {
    this.router.navigate([
      'dashboard/projeto/',
      this.projetoId,
      'requisitos',
      this.requisitoId,
      'inserir-caso',
    ]);
  }

  private buscarMetricas(): void {
    this.casoUsoService.getNumberOfCasos(this.requisitoId).subscribe((data) => {
      this.totalCasos = data.totalCount;
    });

    this.casoUsoService
      .getNumberOfCasosSimples(this.requisitoId)
      .subscribe((data) => {
        this.casosSimples = data.totalCount;
      });

    this.casoUsoService
      .getNumberOfCasosMedios(this.requisitoId)
      .subscribe((data) => {
        this.casosMedios = data.totalCount;
      });

    this.casoUsoService
      .getNumberOfCasosComplexos(this.requisitoId)
      .subscribe((data) => {
        this.casosComplexos = data.totalCount;
      });
  }

  private processarResultado() {
    return (data: any) => {
      this.caso = data.items;
      this.paginaAtual = data.page.number;
      this.tamanhoPagina = data.page.size;
      this.quantidadeElementos = data.page.totalElements;
      this.totalPaginas = data.page.totalPages;
    };
  }

  VisualizarCenarios(item: any) {
    this.router.navigate([
      'dashboard/projeto/',
      this.projetoId,
      'requisitos',
      this.requisitoId,
      'caso-de-uso',
      item,
      'cenarios',
    ]);
  }

  editarItem(item: any) {
    this.router.navigate([
      'dashboard/projeto/',
      this.projetoId,
      'requisitos',
      this.requisitoId,
      'editar-caso',
      item.id,
    ]);
  }

  excluirItem(item: any) {
    this.itemExclusao = item.id;
    this.showModal = true;
  }

  cancelarExclusao() {
    this.showModal = false;
  }

  confirmarExclusao() {
    this.casoUsoService.delete(this.itemExclusao).subscribe(() => {
      this.showModal = false;
      this.executarBusca();
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

  startCasoUsoExecution(casoUsoId: number) {
    // Reset state and open modal
    this.log = [];
    this.executando = true;
    this.showAutomationModal = true;

    // Ensure previous stream is cleaned up
    if (this.executionSub) {
      this.executionSub.unsubscribe?.();
    }

    this.executionSub = this.automationService
      .executarCasoUsoComStream(casoUsoId)
      .subscribe({
        next: (event) => {
          this.ngZone.run(() => {
            if (event.type === 'log' || event.type === 'start') {
              this.log = [
                ...this.log,
                { type: 'text', content: event.message },
              ];
            } else if (event.type === 'image') {
              this.log = [...this.log, { type: 'image', content: event.src }];
            } else if (event.type === 'complete') {
              this.log = [
                ...this.log,
                {
                  type: 'text',
                  content: `✓ Execução concluída: ${event.sucessos} sucesso(s), ${event.falhas} falha(s)`,
                },
              ];
              this.executando = false;
            } else if (event.type === 'error') {
              this.log = [
                ...this.log,
                {
                  type: 'text',
                  content: `✗ Erro: ${event.message}`,
                },
              ];
              this.executando = false;
            }
            this.cdr.markForCheck();
          });
        },
        error: (err) => {
          console.error('Stream error:', err);
          this.ngZone.run(() => {
            this.log = [
              ...this.log,
              {
                type: 'text',
                content: `✗ Erro de conexão: ${err?.message || 'Erro desconhecido'}`,
              },
            ];
            this.executando = false;
            this.cdr.markForCheck();
          });
        },
      });
  }

  closeAutomationModal() {
    if (this.executionSub) {
      this.executionSub.unsubscribe?.();
    }
    this.showAutomationModal = false;
    this.executando = false;
    this.log = [];
  }
}
