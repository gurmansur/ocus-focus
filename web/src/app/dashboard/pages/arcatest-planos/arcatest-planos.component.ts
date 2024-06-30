import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  ],
})
export class ArcatestPlanosComponent {
  projectId!: number;
  openModal: boolean = false;
  mockupData: PlanoDeTeste[] = [
    {
      id: 1,
      nome: 'Plano 1',
      descricao: 'Descrição da Plano 1',
      status: 'Ativo',
      observacoes: 'Observações da Plano 1',
    },
    {
      id: 2,
      nome: 'Plano 2',
      descricao: 'Descrição da Plano 2',
      status: 'Ativo',
      observacoes: 'Observações da Plano 2',
    },
    {
      id: 3,
      nome: 'Plano 3',
      descricao: 'Descrição da Plano 3',
      status: 'Inativo',
      observacoes: 'Observações da Plano 3',
    },
    {
      id: 4,
      nome: 'Plano 4',
      descricao: 'Descrição da Plano 4',
      status: 'Ativo',
      observacoes: 'Observações da Plano 4',
    },
    {
      id: 5,
      nome: 'Plano 5',
      descricao: 'Descrição da Plano 5',
      status: 'Ativo',
      observacoes: 'Observações da Plano 5',
    },
    {
      id: 6,
      nome: 'Plano 6',
      descricao: 'Descrição da Plano 6',
      status: 'Inativo',
      observacoes: 'Observações da Plano 6',
    },
    {
      id: 7,
      nome: 'Plano 7',
      descricao: 'Descrição da Plano 7',
      status: 'Ativo',
      observacoes: 'Observações da Plano 7',
    },
    {
      id: 8,
      nome: 'Plano 8',
      descricao: 'Descrição da Plano 8',
      status: 'Ativo',
      observacoes: 'Observações da Plano 8',
    },
    {
      id: 9,
      nome: 'Plano 9',
      descricao: 'Descrição da Plano 9',
      status: 'Inativo',
      observacoes: 'Observações da Plano 9',
    },
    {
      id: 10,
      nome: 'Plano 10',
      descricao: 'Descrição da Plano 10',
      status: 'Ativo',
      observacoes: 'Observações da Plano 10',
    },
  ];
  planToDelete: any;

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

  deletePlan() {
    this.mockupData = this.mockupData.filter(
      (plano) => plano.id !== this.planToDelete?.id
    );
    this.openModal = false;
  }

  openDeleteModal(id: number) {
    this.planToDelete = this.mockupData.find((plano) => plano.id === id);
    this.openModal = true;
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
}
