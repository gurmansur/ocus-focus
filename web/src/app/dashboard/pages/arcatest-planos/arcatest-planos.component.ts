import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import { PlanoDeTeste } from '../../models/planoDeTeste';

@Component({
  selector: 'app-arcatest-planos',
  standalone: true,
  templateUrl: './arcatest-planos.component.html',
  styleUrl: './arcatest-planos.component.css',
  imports: [
    ProjectHeaderComponent,
    TableComponent,
    PlusIconComponent,
    ButtonComponent,
    ModalComponent,
    NgxChartsModule,
    ContentModalComponent,
  ],
})
export class ArcatestPlanosComponent {
  projectId!: number;
  legendPosition: LegendPosition = LegendPosition.Below;
  openCoverage: boolean = false;
  openDelete: boolean = false;
  planToDelete?: PlanoDeTeste;
  mockupData: PlanoDeTeste[] = [
    {
      id: 1,
      nome: 'Plano 1',
      data: '2021-09-01',
      descricao: 'Descrição da Plano 1',
      status: 'ATIVO',
      observacoes: 'Observações da Plano 1',
    },
    {
      id: 2,
      nome: 'Plano 2',
      data: '2021-09-01',
      descricao: 'Descrição da Plano 2',
      status: 'ATIVO',
      observacoes: 'Observações da Plano 2',
    },
    {
      id: 3,
      nome: 'Plano 3',
      data: '2021-09-01',
      descricao: 'Descrição da Plano 3',
      status: 'Inativo',
      observacoes: 'Observações da Plano 3',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
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

  deletePlan() {
    this.mockupData = this.mockupData.filter(
      (plano) => plano.id !== this.planToDelete?.id
    );
    this.openDelete = false;
  }

  openDeleteModal(id: number) {
    this.planToDelete = this.mockupData.find((plano) => plano.id === id);
    this.openDelete = true;
  }

  navigateToEditPlan(id: number) {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'planos-teste',
      id,
      'editar',
    ]);
  }

  navigateToCreatePlan() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'planos-teste',
      'criar',
    ]);
  }

  navigateToSuites(id: number) {
    this.router.navigate(
      ['/dashboard/projeto/', this.projectId, 'suites-teste'],
      { queryParams: { planoId: id } }
    );
  }

  openCoverageModal() {
    this.openCoverage = true;
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }
}
