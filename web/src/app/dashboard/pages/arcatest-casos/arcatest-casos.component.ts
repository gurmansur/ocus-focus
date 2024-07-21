import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import {
  CasoDeTeste,
  ECategoria,
  EComplexidade,
  EPrioridade,
  EStatus,
  ETecnica,
} from '../../models/casoDeTeste';

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
  mockupData: CasoDeTeste[] = [
    {
      id: 1,
      nome: 'Caso de Teste 1',
      descricao: 'Descrição do Caso de Teste 1',
      status: EStatus.ATIVO,
      complexidade: EComplexidade.BAIXA,
      prioridade: EPrioridade.BAIXA,
      tecnica: ETecnica.FUNCIONAL,
      suite: {
        id: 1,
        nome: 'Suite 1',
        descricao: 'Descrição da Suite 1',
        status: 'Ativo',
        observacoes: 'Observações da Suite 1',
      },
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 1',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 1',
      entrada: 'Passos do Caso de Teste 1',
      categoria: ECategoria.MANUAL,
      casoDeUso: {
        id: 1,
        nome: 'Caso de Uso 1',
        descricao: 'Descrição do Caso de Uso 1',
        complexidade: EComplexidade.BAIXA,
      },
    },
    {
      id: 2,
      nome: 'Caso de Teste 2',
      descricao: 'Descrição do Caso de Teste 2',
      status: EStatus.ATIVO,
      complexidade: EComplexidade.BAIXA,
      prioridade: EPrioridade.BAIXA,
      tecnica: ETecnica.FUNCIONAL,
      suite: {
        id: 1,
        nome: 'Suite 1',
        descricao: 'Descrição da Suite 1',
        status: 'Ativo',
        observacoes: 'Observações da Suite 1',
      },
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 2',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 2',
      entrada: 'Passos do Caso de Teste 2',
      categoria: ECategoria.MANUAL,
      casoDeUso: {
        id: 1,
        nome: 'Caso de Uso 1',
        descricao: 'Descrição do Caso de Uso 1',
        complexidade: EComplexidade.BAIXA,
      },
    },
    {
      id: 3,
      nome: 'Caso de Teste 3',
      descricao: 'Descrição do Caso de Teste 3',
      status: EStatus.ATIVO,
      complexidade: EComplexidade.BAIXA,
      prioridade: EPrioridade.BAIXA,
      tecnica: ETecnica.FUNCIONAL,
      suite: {
        id: 1,
        nome: 'Suite 1',
        descricao: 'Descrição da Suite 1',
        status: 'Ativo',
        observacoes: 'Observações da Suite 1',
      },
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 3',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 3',
      entrada: 'Passos do Caso de Teste 3',
      categoria: ECategoria.MANUAL,
      casoDeUso: {
        id: 1,
        nome: 'Caso de Uso 1',
        descricao: 'Descrição do Caso de Uso 1',
        complexidade: EComplexidade.BAIXA,
      },
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.suiteId = this.route.snapshot.queryParams['suiteId'];

    if (this.suiteId) {
      this.filterTestCasesBySuite();
    }
  }

  filterTestCasesBySuite() {
    if (this.suiteId !== undefined) {
      this.mockupData = this.mockupData.filter(
        (testCase) => testCase.suite?.id === +this.suiteId
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
    const testCase = this.mockupData.find((testCase) => testCase.id === id);
    this.testCaseToDelete = testCase;
    this.openDelete = true;
  }

  deleteTestCase() {
    console.log('Deleting test case', this.testCaseToDelete);
    this.mockupData = this.mockupData.filter(
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
