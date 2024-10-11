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
import { ExecucaoTeste } from '../../models/execucaoTeste';
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
  executionToDelete?: ExecucaoTeste;
  casoId: string;
  casosDeTeste: CasoDeTeste[] = [];

  mockupData: ExecucaoTeste[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.casoId = this.route.snapshot.queryParams['casoId'];

    if (this.casoId) {
      this.filterTestCasesByCaso();
    }
  }

  filterTestCasesByCaso() {
    if (this.casoId !== undefined) {
      this.mockupData = this.mockupData.filter(
        (execution) => execution.casoDeTeste.id === Number(this.casoId)
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
    this.mockupData = this.mockupData.filter(
      (execution) => execution.id !== this.executionToDelete?.id
    );
    this.openDelete = false;
  }

  openDeleteModal(id: number) {
    this.executionToDelete = this.mockupData.find(
      (execution) => execution.id === id
    );
    this.openDelete = true;
  }

  navigateToEditExecution(id: number) {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'execucoes-teste',
      id,
      'editar',
    ]);
  }

  navigateToCreateExecution() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'execucoes-teste',
      'criar',
    ]);
  }

  openCoverageModal() {
    this.openCoverage = true;
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }

  openExecutionModal() {
    this.openExecution = true;
  }

  closeExecutionModal() {
    this.openExecution = false;
  }
}
