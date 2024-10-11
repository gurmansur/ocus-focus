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
import { CardComponent } from 'src/app/shared/card/card.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import {
  CasoDeTeste,
  ECategoria,
  EComplexidade,
  EPrioridade,
  EStatus,
  ETecnica,
} from '../../models/casoDeTeste';
import { casoUso } from '../../models/casoUso';
import { Colaborador } from '../../models/colaborador';
import { PlanoDeTeste } from '../../models/planoDeTeste';
import { SuiteDeTeste } from '../../models/suiteDeTeste';

@Component({
  selector: 'app-arcatest-casos-form',
  standalone: true,
  templateUrl: './arcatest-casos-form.component.html',
  styleUrl: './arcatest-casos-form.component.css',
  imports: [
    ProjectHeaderComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    PlusIconComponent,
    ButtonComponent,
  ],
})
export class ArcatestCasosFormComponent {
  projectId!: number;
  idCaso!: number;
  isEdit: boolean = false;
  casoDeTesteFormGroup: any;
  formBuilder: FormBuilder = new FormBuilder();
  casoDeTeste?: CasoDeTeste;
  planosDeTeste: PlanoDeTeste[] = [];
  suites: SuiteDeTeste[] = [];

  testadores: Colaborador[] = [];

  mockupData: CasoDeTeste[] = [];
  casosDeUso: casoUso[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.idCaso = this.route.snapshot.params['idCaso'];
    this.isEdit = !!this.idCaso;

    // this.casoDeTeste = this.mockupData[this.idCaso - 1];
  }

  navigateToArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
    ]);
  }

  createTestCase() {
    console.log(this.casoDeTesteFormGroup.value);
  }

  ngOnInit() {
    this.casoDeTesteFormGroup = this.formBuilder.group({
      nome: new FormControl(this.casoDeTeste?.nome || '', Validators.required),
      descricao: new FormControl(
        this.casoDeTeste?.descricao || '',
        Validators.required
      ),
      preCondicoes: new FormControl(this.casoDeTeste?.preCondicoes || ''),
      posCondicoes: new FormControl(this.casoDeTeste?.posCondicoes || ''),
      prioridade: new FormControl(
        this.casoDeTeste?.prioridade || EPrioridade.BAIXA,
        Validators.required
      ),
      complexidade: new FormControl(
        this.casoDeTeste?.complexidade || EComplexidade.BAIXA,
        Validators.required
      ),
      tecnica: new FormControl(
        this.casoDeTeste?.tecnica || ETecnica.FUNCIONAL,
        Validators.required
      ),
      status: new FormControl(
        this.casoDeTeste?.status || EStatus.ATIVO,
        Validators.required
      ),
      categoria: new FormControl(
        this.casoDeTeste?.categoria || ECategoria.MANUAL,
        Validators.required
      ),
      suiteDeTeste: new FormControl(this.casoDeTeste?.suiteDeTeste?.id || ''),
      testador: new FormControl(this.casoDeTeste?.testador?.id || ''),
      observacoes: new FormControl(this.casoDeTeste?.observacoes || ''),
      resultadoEsperado: new FormControl(
        this.casoDeTeste?.resultadoEsperado || '',
        Validators.required
      ),
      entrada: new FormControl(
        this.casoDeTeste?.entrada || '',
        Validators.required
      ),
      casoDeUso: new FormControl(
        this.casoDeTeste?.casoDeUso.id || '',
        Validators.required
      ),
    });
  }

  get nome() {
    return this.casoDeTesteFormGroup.get('nome');
  }

  get descricao() {
    return this.casoDeTesteFormGroup.get('descricao');
  }

  get preCondicoes() {
    return this.casoDeTesteFormGroup.get('preCondicoes');
  }

  get posCondicoes() {
    return this.casoDeTesteFormGroup.get('posCondicoes');
  }

  get prioridade() {
    return this.casoDeTesteFormGroup.get('prioridade');
  }

  get complexidade() {
    return this.casoDeTesteFormGroup.get('complexidade');
  }

  get tecnica() {
    return this.casoDeTesteFormGroup.get('tecnica');
  }

  get status() {
    return this.casoDeTesteFormGroup.get('status');
  }

  get suite() {
    return this.casoDeTesteFormGroup.get('suite');
  }

  get testador() {
    return this.casoDeTesteFormGroup.get('testador');
  }

  get dataCriacao() {
    return this.casoDeTesteFormGroup.get('dataCriacao');
  }

  get observacoes() {
    return this.casoDeTesteFormGroup.get('observacoes');
  }

  get resultadoEsperado() {
    return this.casoDeTesteFormGroup.get('resultadoEsperado');
  }

  get entrada() {
    return this.casoDeTesteFormGroup.get('entrada');
  }

  get isFormValid() {
    return this.casoDeTesteFormGroup.valid;
  }

  navigateToTestCases() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'casos-teste',
    ]);
  }
}
