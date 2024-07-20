import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ButtonComponent } from '../../../shared/button/button.component';
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
import { CasoDeTeste } from '../../models/casoDeTeste';
import { ExecucaoTeste } from '../../models/execucaoTeste';

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
  ],
})
export class ArcatestExecucoesComponent {
  projectId!: number;
  openDelete: boolean = false;
  openCoverage: boolean = false;
  executionToDelete?: ExecucaoTeste;
  casoId: string;
  casosDeTeste: CasoDeTeste[] = [
    {
      id: 1,
      nome: 'Caso de Teste 1',
      descricao: 'Descrição do Caso de Teste 1',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
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
      passos: 'Passos do Caso de Teste 1',
    },
    {
      id: 2,
      nome: 'Caso de Teste 2',
      descricao: 'Descrição do Caso de Teste 2',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
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
      passos: 'Passos do Caso de Teste 2',
    },
    {
      id: 3,
      nome: 'Caso de Teste 3',
      descricao: 'Descrição do Caso de Teste 3',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: {
        id: 2,
        nome: 'Suite 2',
        descricao: 'Descrição da Suite 2',
        status: 'Ativo',
        observacoes: 'Observações da Suite 2',
      },
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 3',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 3',
      passos: 'Passos do Caso de Teste 3',
    },
    {
      id: 4,
      nome: 'Caso de Teste 4',
      descricao: 'Descrição do Caso de Teste 4',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: {
        id: 2,
        nome: 'Suite 2',
        descricao: 'Descrição da Suite 2',
        status: 'Ativo',
        observacoes: 'Observações da Suite 2',
      },
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 4',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 4',
      passos: 'Passos do Caso de Teste 4',
    },
    {
      id: 5,
      nome: 'Caso de Teste 5',
      descricao: 'Descrição do Caso de Teste 5',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: {
        id: 3,
        nome: 'Suite 3',
        descricao: 'Descrição da Suite 3',
        status: 'Inativo',
        observacoes: 'Observações da Suite 3',
      },
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 5',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 5',
      passos: 'Passos do Caso de Teste 5',
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
}
