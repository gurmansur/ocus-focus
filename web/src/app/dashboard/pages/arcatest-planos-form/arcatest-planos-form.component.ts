import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { PlanoDeTeste } from '../../models/planoDeTeste';

@Component({
  selector: 'app-arcatest-planos-form',
  standalone: true,
  templateUrl: './arcatest-planos-form.component.html',
  styleUrl: './arcatest-planos-form.component.css',
  imports: [
    ButtonComponent,
    PlusIconComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectHeaderComponent,
  ],
})
export class ArcatestPlanosFormComponent {
  projectId!: number;
  planoId!: number;
  plano!: PlanoDeTeste;
  openModal: boolean = false;
  isEdit: boolean = false;
  planoFormGroup: any;
  formBuilder: FormBuilder = new FormBuilder();
  planoToDelete?: PlanoDeTeste;
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
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.planoId = this.route.snapshot.params['idPlano'];
    this.isEdit = !!this.planoId;

    this.plano = this.mockupData[this.planoId - 1];
  }

  ngOnInit(): void {
    this.planoFormGroup = this.formBuilder.group({
      nome: new FormControl(this.plano?.nome || '', Validators.required),
      descricao: new FormControl(
        this.plano?.descricao || '',
        Validators.required
      ),
      status: new FormControl(this.plano?.status || '', Validators.required),
      observacoes: new FormControl(this.plano?.observacoes || ''),
    });
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

  deleteTestPlano() {
    this.mockupData = this.mockupData.filter(
      (plano) => plano.id !== this.planoToDelete?.id
    );
    this.openModal = false;
  }

  openDeleteModal(id: number) {
    this.planoToDelete = this.mockupData.find((plano) => plano.id === id);
    this.openModal = true;
  }

  navigateToTestPlanos() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'planos-teste',
    ]);
  }

  createTestPlano() {
    console.log(this.planoFormGroup.value);
  }

  get nome() {
    return this.planoFormGroup.get('nome');
  }

  get descricao() {
    return this.planoFormGroup.get('descricao');
  }

  get status() {
    return this.planoFormGroup.get('status');
  }

  get observacoes() {
    return this.planoFormGroup.get('observacoes');
  }

  get isFormValid() {
    return this.planoFormGroup.valid;
  }
}
