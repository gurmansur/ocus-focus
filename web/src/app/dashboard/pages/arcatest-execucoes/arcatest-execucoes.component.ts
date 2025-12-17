import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CasoDeTeste } from '../../models/casoDeTeste';
import { ExecucaoDeTeste } from '../../models/execucaoDeTeste';
import { ExecutarTeste } from '../../models/executarTeste';
import { ExecucaoDeTesteService } from '../../services/execucoesDeTeste.service';
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private execucaoDeTesteService: ExecucaoDeTesteService,
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
}
