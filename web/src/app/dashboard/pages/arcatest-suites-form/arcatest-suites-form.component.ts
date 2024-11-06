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
import { SuiteDeTesteService } from '../../services/suiteDeTeste.service';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private suiteDeTesteService: SuiteDeTesteService
  ) {
    this.projectId = this.route.parent?.snapshot.params['id'];
    this.suiteId = this.route.snapshot.params['idSuite'];
    this.isEdit = !!this.suiteId;
    if (this.isEdit) {
      this.getSuite();
    }
  }

  getSuite() {
    this.suiteDeTesteService.getById(this.suiteId).subscribe({
      next: (suite) => {
        this.suite = suite;
        this.createFormGroup();
      },
    });
  }

  ngOnInit(): void {
    this.createFormGroup();
  }

  createFormGroup() {
    this.suiteFormGroup = this.formBuilder.group({
      nome: new FormControl(this.suite?.nome || '', Validators.required),
      descricao: new FormControl(
        this.suite?.descricao || '',
        Validators.required
      ),
      observacoes: new FormControl(this.suite?.observacoes || ''),
      suitePaiId: this.route.snapshot.queryParams['suiteId'] || '',
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
      'painel-arcatest',
      'arvore',
    ]);
  }

  createTestSuite() {
    this.suiteDeTesteService.create(this.suiteFormGroup.value).subscribe({
      next: () => {
        this.navigateToTestSuites();
      },
    });
  }

  updateTestSuite() {
    this.suiteDeTesteService
      .update(this.suiteId, this.suiteFormGroup.value)
      .subscribe({
        next: () => {
          this.navigateToArcaTest();
        },
      });
  }

  get nome() {
    return this.suiteFormGroup.get('nome');
  }

  get descricao() {
    return this.suiteFormGroup.get('descricao');
  }

  get observacoes() {
    return this.suiteFormGroup.get('observacoes');
  }

  get isFormValid() {
    return this.suiteFormGroup.valid;
  }
}
