import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { ExecucaoDeTesteService as ExecucaoDeTesteAutomationService } from '../../../shared/services/execucao-de-teste.service';
import { TableComponent } from '../../../shared/table/table.component';
import { CasoDeTeste } from '../../models/casoDeTeste';
import { ExecucaoDeTeste } from '../../models/execucaoDeTeste';
import { ExecutarTeste } from '../../models/executarTeste';
import { ExecucaoDeTesteService } from '../../services/execucoesDeTeste.service';
import {
  LogEntry,
  TestExecutionModalComponent,
} from '../shared/test-execution-modal/test-execution-modal.component';
import { ArcatestExecucoesModalComponent } from './components/arcatest-execucoes-modal/arcatest-execucoes-modal.component';

@Component({
  selector: 'app-arcatest-execucoes',
  standalone: true,
  templateUrl: './arcatest-execucoes.component.html',
  styleUrl: './arcatest-execucoes.component.css',
  imports: [
    ProjectHeaderComponent,
    TableComponent,
    PlusIconComponent,
    ButtonComponent,
    ModalComponent,
    NgxChartsModule,
    ContentModalComponent,
    ArcatestExecucoesModalComponent,
    TestExecutionModalComponent,
  ],
})
export class ArcatestExecucoesComponent {
  projectId!: number;
  legendPosition: LegendPosition = LegendPosition.Below;
  openDelete: boolean = false;
  openCoverage: boolean = false;
  openExecution: boolean = false;
  executionToDelete?: ExecucaoDeTeste;
  casoId: string;
  executarTeste!: ExecutarTeste;
  casosDeTeste: CasoDeTeste[] = [];

  execucoes: ExecucaoDeTeste[] = [];

  status?: string;

  // Automated execution state
  showAutomationModal = false;
  executando = false;
  log: LogEntry[] = [];
  selectedExecution?: ExecucaoDeTeste;
  private executionSub?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private execucaoDeTesteService: ExecucaoDeTesteService,
    private automationService: ExecucaoDeTesteAutomationService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
  ) {
    this.casoId = this.route.snapshot.queryParams['casoId'];

    this.fetchExecucoes();
  }

  ngOnInit(): void {
    this.projectId = this.route.parent?.snapshot.params['id'];
  }

  fetchExecucoes() {
    this.execucaoDeTesteService.getAll().subscribe((execucoes) => {
      this.execucoes = execucoes
        .map((execucao) => ({
          ...execucao,
          data: new Date(execucao.dataExecucao).toLocaleDateString(),
          hora: new Date(execucao.dataExecucao).toLocaleTimeString(),
        }))
        .sort((a, b) => {
          // Sort by most recent date and time first
          const dateA = new Date(a.dataExecucao).getTime();
          const dateB = new Date(b.dataExecucao).getTime();
          return dateB - dateA; // Descending order (most recent first)
        });

      if (this.casoId !== undefined) {
        this.filterTestCasesByCaso();
      }
    });
  }

  onModalValueChange(value: ExecutarTeste) {
    this.executarTeste = value;
  }

  filterTestCasesByCaso() {
    if (this.casoId !== undefined) {
      this.execucoes = this.execucoes.filter(
        (execution) => execution.casoDeTeste.id === Number(this.casoId),
      );
    }
  }

  navigateToArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
    ]);
  }

  closeDeleteModal() {
    this.openDelete = false;
  }

  deleteExecution() {
    if (this.executionToDelete) {
      this.execucaoDeTesteService
        .delete(this.executionToDelete.id)
        .subscribe(() => {
          this.fetchExecucoes();
          this.openDelete = false;
        });
    }
  }

  openDeleteModal(id: number) {
    this.executionToDelete = this.execucoes.find(
      (execution) => execution.id === id,
    );
    this.openDelete = true;
  }

  changeExecutionStatus(id: number) {
    this.execucaoDeTesteService
      .changeStatus(id, this.executarTeste || {})
      .subscribe(() => {
        this.closeExecutionModal();
        this.fetchExecucoes();
      });
  }

  navigateToEditExecution(id: number) {
    this.router.navigate([
      '/dashboard/projeto',
      this.projectId,
      'painel-arcatest',
      'execucoes',
      'editar',
      id,
    ]);
  }

  navigateToCreateExecution() {
    this.router.navigate([
      '/dashboard/projeto',
      this.projectId,
      'painel-arcatest',
      'execucoes',
      'criar',
    ]);
  }

  openCoverageModal() {
    this.openCoverage = true;
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }

  openExecutionModal(id: number) {
    const execution = this.execucoes.find((execution) => execution.id === id);
    this.executarTeste = {
      id: execution!.id,
      resultado: execution!.resultado,
      observacao: execution!.observacao,
    };
    this.openExecution = true;
  }

  closeExecutionModal() {
    this.openExecution = false;
  }

  startAutomatedExecution(id: number) {
    const execution = this.execucoes.find((item) => item.id === id);
    if (!execution) return;

    // Check if test case is set to automated
    if (execution.casoDeTeste.metodo !== 'AUTOMATIZADO') {
      // For manual test cases, open the manual status modal instead
      this.openExecutionModal(id);
      return;
    }

    // Reset state and open modal
    this.selectedExecution = execution;
    this.log = [];
    this.executando = true;
    this.showAutomationModal = true;

    // Ensure previous stream is cleaned up
    if (this.executionSub) {
      this.executionSub.unsubscribe?.();
    }

    this.executionSub = this.automationService
      .executarComStream(execution.casoDeTeste.id ?? 0)
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
                  content: `✓ Execução concluída: ${
                    event.sucesso ? 'SUCESSO' : 'FALHA'
                  }`,
                },
              ];
              this.executando = false;
              this.updateExecutionStatus(
                execution.id,
                event.sucesso ? 'SUCESSO' : 'FALHA',
                event.mensagem,
              );
            } else if (event.type === 'error') {
              this.log = [
                ...this.log,
                {
                  type: 'text',
                  content: `✗ Erro: ${event.message}`,
                },
              ];
              this.executando = false;
              this.updateExecutionStatus(execution.id, 'FALHA', event.message);
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
                content: `✗ Erro de conexão: ${
                  err?.message || 'Erro desconhecido'
                }`,
              },
            ];
            this.executando = false;
            this.updateExecutionStatus(
              execution.id,
              'FALHA',
              err?.message || 'Erro de conexão',
            );
            this.cdr.markForCheck();
          });
        },
      });
  }

  private updateExecutionStatus(
    id: number,
    resultado: 'SUCESSO' | 'FALHA',
    observacao?: string,
  ) {
    this.execucaoDeTesteService
      .changeStatus(id, { resultado, observacao })
      .subscribe(() => this.fetchExecucoes());
  }

  closeAutomationModal() {
    if (this.executionSub) {
      this.executionSub.unsubscribe?.();
    }
    this.showAutomationModal = false;
    this.executando = false;
    this.log = [];
    this.selectedExecution = undefined;
  }
}
