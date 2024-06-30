import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';
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
  ],
})
export class ArcatestExecucoesComponent {
  projectId!: number;
  openModal: boolean = false;
  executionToDelete?: ExecucaoTeste;
  mockupData: ExecucaoTeste[] = [
    {
      id: 1,
      nome: 'Execução 1',
      status: 'Aprovado',
      data: '01/01/2021',
      hora: '10:00',
      colaborador: {
        nome: 'Usuário 1',
        email: 'a@a.a',
        empresa: 'Empresa 1',
        cargo: 'Cargo 1',
        id: 1,
      },
    },
    {
      id: 2,
      nome: 'Execução 2',
      status: 'Pendente',
      data: '02/01/2021',
      hora: '11:00',
      colaborador: {
        nome: 'Usuário 2',
        email: 'b@b.b',
        empresa: 'Empresa 2',
        cargo: 'Cargo 2',
        id: 2,
      },
    },
    {
      id: 3,
      nome: 'Execução 3',
      status: 'Aprovado',
      data: '03/01/2021',
      hora: '12:00',
      colaborador: {
        nome: 'Usuário 3',
        email: 'c@c.c',
        empresa: 'Empresa 3',
        cargo: 'Cargo 3',
        id: 3,
      },
    },
    {
      id: 4,
      nome: 'Execução 4',
      status: 'Pendente',
      data: '04/01/2021',
      hora: '13:00',
      colaborador: {
        nome: 'Usuário 4',
        email: 'd@d.d',
        empresa: 'Empresa 4',
        cargo: 'Cargo 4',
        id: 4,
      },
    },
    {
      id: 5,
      nome: 'Execução 5',
      status: 'Reprovado',
      data: '05/01/2021',
      hora: '14:00',
      colaborador: {
        nome: 'Usuário 5',
        email: 'e@e.e',
        empresa: 'Empresa 5',
        cargo: 'Cargo 5',
        id: 5,
      },
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

  closeModal() {
    this.openModal = false;
  }

  deleteExecution() {
    this.mockupData = this.mockupData.filter(
      (execution) => execution.id !== this.executionToDelete?.id
    );
    this.openModal = false;
  }

  openDeleteModal(id: number) {
    this.executionToDelete = this.mockupData.find(
      (execution) => execution.id === id
    );
    this.openModal = true;
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
}
