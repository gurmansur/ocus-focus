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
import { SuiteDeTeste } from '../../models/suiteDeTeste';

@Component({
  selector: 'app-arcatest-suites-form',
  standalone: true,
  templateUrl: './arcatest-suites-form.component.html',
  styleUrl: './arcatest-suites-form.component.css',
  imports: [
    ButtonComponent,
    PlusIconComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProjectHeaderComponent,
  ],
})
export class ArcatestSuitesFormComponent {
  projectId!: number;
  suiteId!: number;
  suite!: SuiteDeTeste;
  openModal: boolean = false;
  isEdit: boolean = false;
  suiteFormGroup: any;
  formBuilder: FormBuilder = new FormBuilder();
  suiteToDelete?: SuiteDeTeste;
  planosDeTeste: PlanoDeTeste[] = [];
  mockupData: SuiteDeTeste[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.suiteId = this.route.snapshot.params['idSuite'];
    this.isEdit = !!this.suiteId;
    this.suite = this.mockupData[this.suiteId - 1];
  }

  ngOnInit(): void {
    this.suiteFormGroup = this.formBuilder.group({
      nome: new FormControl(this.suite?.nome || '', Validators.required),
      descricao: new FormControl(
        this.suite?.descricao || '',
        Validators.required
      ),
      status: new FormControl(this.suite?.status || '', Validators.required),
      observacoes: new FormControl(this.suite?.observacoes || ''),
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

  deleteTestSuite() {
    this.mockupData = this.mockupData.filter(
      (suite) => suite.id !== this.suiteToDelete?.id
    );
    this.openModal = false;
  }

  openDeleteModal(id: number) {
    this.suiteToDelete = this.mockupData.find((suite) => suite.id === id);
    this.openModal = true;
  }

  navigateToTestSuites() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'suites-teste',
    ]);
  }

  createTestSuite() {
    console.log(this.suiteFormGroup.value);
  }

  get nome() {
    return this.suiteFormGroup.get('nome');
  }

  get descricao() {
    return this.suiteFormGroup.get('descricao');
  }

  get status() {
    return this.suiteFormGroup.get('status');
  }

  get observacoes() {
    return this.suiteFormGroup.get('observacoes');
  }

  get isFormValid() {
    return this.suiteFormGroup.valid;
  }
}
