import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CasoDeTeste } from '../../models/casoDeTeste';
import { CasoDeTesteService } from '../../services/casoDeTeste.service';

@Component({
  selector: 'app-arcatest-casos',
  standalone: true,
  templateUrl: './arcatest-casos.component.html',
  styleUrl: './arcatest-casos.component.css',
  imports: [
    ProjectHeaderComponent,
    TableComponent,
    ButtonComponent,
    PlusIconComponent,
    ModalComponent,
    NgxChartsModule,
    ContentModalComponent,
  ],
})
export class ArcatestCasosComponent {
  projectId!: number;
  legendPosition: LegendPosition = LegendPosition.Below;
  openCoverage: boolean = false;
  openDelete: boolean = false;
  testCaseToDelete?: CasoDeTeste;
  suiteId: number;
  casosDeTeste!: CasoDeTeste[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private casoDeTesteService: CasoDeTesteService
  ) {
    this.projectId = this.route.snapshot.params['id'];
    this.suiteId = this.route.snapshot.queryParams['suiteId'];
  }

  ngOnInit(): void {
    this.casoDeTesteService.getAll().subscribe((data) => {
      this.casosDeTeste = data.filter(
        (testCase) => testCase.suiteDeTeste?.id === +this.suiteId
      );
    });
  }

  navigateToArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
    ]);
  }

  navigateToCreateTestCase() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'casos-teste',
      'criar',
    ]);
  }

  navigateToEditTestCase(id: number) {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'casos-teste',
      id,
      'editar',
    ]);
  }

  closeDeleteModal() {
    this.openDelete = false;
  }

  openDeleteModal(id: number) {
    const testCase = this.casosDeTeste.find((testCase) => testCase.id === id);
    this.testCaseToDelete = testCase;
    this.openDelete = true;
  }

  deleteTestCase() {
    console.log('Deleting test case', this.testCaseToDelete);
    this.casosDeTeste = this.casosDeTeste.filter(
      (testCase) => testCase.id !== this.testCaseToDelete?.id
    );
    this.openDelete = false;
  }

  navigateToExecutions(id: number) {
    this.router.navigate(
      ['/dashboard/projeto/', this.projectId, 'execucoes-teste'],
      { queryParams: { casoId: id } }
    );
  }

  navigateToUseCase(id: number) {
    console.log('Navigating to use case', id);
  }

  openCoverageModal() {
    this.openCoverage = true;
  }

  closeCoverageModal() {
    this.openCoverage = false;
  }
}
