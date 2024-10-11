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
import { SuiteDeTeste } from '../../models/suiteDeTeste';

@Component({
  selector: 'app-arcatest-suites',
  standalone: true,
  templateUrl: './arcatest-suites.component.html',
  styleUrl: './arcatest-suites.component.css',
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
export class ArcatestSuitesComponent {
  projectId!: number;
  legendPosition: LegendPosition = LegendPosition.Below;
  openDelete: boolean = false;
  openCoverage: boolean = false;
  planoId!: number;
  suiteToDelete?: SuiteDeTeste;
  planosDeTeste: PlanoDeTeste[] = [];
  mockupData: SuiteDeTeste[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.planoId = this.route.snapshot.queryParams['planoId'];
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

  deleteSuite() {
    this.mockupData = this.mockupData.filter(
      (suite) => suite.id !== this.suiteToDelete?.id
    );
    this.openDelete = false;
  }

  openDeleteModal(id: number) {
    this.suiteToDelete = this.mockupData.find((suite) => suite.id === id);
    this.openDelete = true;
  }

  navigateToEditSuite(id: number) {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'suites-teste',
      id,
      'editar',
    ]);
  }

  navigateToCreateSuite() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'suites-teste',
      'criar',
    ]);
  }

  navigateToCases(id: number) {
    this.router.navigate(
      ['/dashboard/projeto/', this.projectId, 'casos-teste'],
      { queryParams: { suiteId: id } }
    );
  }

  openCoverageModal() {
    this.openCoverage = true;
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }
}
