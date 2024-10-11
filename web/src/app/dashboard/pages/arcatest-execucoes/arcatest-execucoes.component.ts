import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LegendPosition, NgxChartsModule } from '@swimlane/ngx-charts';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
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
  casosDeTeste: CasoDeTeste[] = [
    {
      id: 1,
      nome: 'Caso de Teste 1',
      descricao: 'Descrição do Caso de Teste 1',
      status: EStatus.ATIVO,
      complexidade: EComplexidade.BAIXA,
      prioridade: EPrioridade.BAIXA,
      tecnica: ETecnica.FUNCIONAL,
      suiteDeTeste: {
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
      suiteDeTeste: {
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
      suiteDeTeste: {
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

  mockupData: ExecucaoTeste[] = [
    {
      id: 1,
      nome: 'Execução 1',
      status: 'Aprovado',
      data: '2021-01-01',
      hora: '10:00',
      colaborador: {
        nome: 'Usuário 1',
        email: 'a@a.a',
        empresa: 'Empresa 1',
        cargo: 'Cargo 1',
        id: 1,
      },
      casoDeTeste: this.casosDeTeste[0],
    },
    {
      id: 2,
      nome: 'Execução 2',
      status: 'Pendente',
      data: '2021-01-02',
      hora: '11:00',
      colaborador: {
        nome: 'Usuário 2',
        email: 'b@b.b',
        empresa: 'Empresa 2',
        cargo: 'Cargo 2',
        id: 2,
      },
      casoDeTeste: this.casosDeTeste[1],
    },
    {
      id: 3,
      nome: 'Execução 3',
      status: 'Aprovado',
      data: '2021-01-03',
      hora: '12:00',
      colaborador: {
        nome: 'Usuário 3',
        email: 'c@c.c',
        empresa: 'Empresa 3',
        cargo: 'Cargo 3',
        id: 3,
      },
      casoDeTeste: this.casosDeTeste[2],
    },
    {
      id: 4,
      nome: 'Execução 4',
      status: 'Pendente',
      data: '2021-01-04',
      hora: '13:00',
      colaborador: {
        nome: 'Usuário 4',
        email: 'd@d.d',
        empresa: 'Empresa 4',
        cargo: 'Cargo 4',
        id: 4,
      },
      casoDeTeste: this.casosDeTeste[3],
    },
    {
      id: 5,
      nome: 'Execução 5',
      status: 'Reprovado',
      data: '2021-01-05',
      hora: '14:00',
      colaborador: {
        nome: 'Usuário 5',
        email: 'e@e.e',
        empresa: 'Empresa 5',
        cargo: 'Cargo 5',
        id: 5,
      },
      casoDeTeste: this.casosDeTeste[4],
    },
  ];

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
