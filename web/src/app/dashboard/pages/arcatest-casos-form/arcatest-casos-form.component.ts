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
import { CasoDeTeste } from '../../models/casoDeTeste';

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
  mockupData: CasoDeTeste[] = [
    {
      id: 1,
      nome: 'Caso de Teste 1',
      descricao: 'Descrição do Caso de Teste 1',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: 'Suite 1',
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 1',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 1',
      passos: 'Passos do Caso de Teste 1',
      preCondicoes: 'Pré-condições do Caso de Teste 1',
      posCondicoes: 'Pós-condições do Caso de Teste 1',
    },
    {
      id: 2,
      nome: 'Caso de Teste 2',
      descricao: 'Descrição do Caso de Teste 2',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: 'Suite 1',
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 2',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 2',
      passos: 'Passos do Caso de Teste 2',
      preCondicoes: 'Pré-condições do Caso de Teste 2',
      posCondicoes: 'Pós-condições do Caso de Teste 2',
    },
    {
      id: 3,
      nome: 'Caso de Teste 3',
      descricao: 'Descrição do Caso de Teste 3',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: 'Suite 1',
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 3',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 3',
      passos: 'Passos do Caso de Teste 3',
      preCondicoes: 'Pré-condições do Caso de Teste 3',
      posCondicoes: 'Pós-condições do Caso de Teste 3',
    },
    {
      id: 4,
      nome: 'Caso de Teste 4',
      descricao: 'Descrição do Caso de Teste 4',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: 'Suite 1',
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 4',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 4',
      passos: 'Passos do Caso de Teste 4',
      preCondicoes: 'Pré-condições do Caso de Teste 4',
      posCondicoes: 'Pós-condições do Caso de Teste 4',
    },
    {
      id: 5,
      nome: 'Caso de Teste 5',
      descricao: 'Descrição do Caso de Teste 5',
      status: 'Ativo',
      complexidade: 'Baixa',
      prioridade: 'Baixa',
      tipo: 'Funcional',
      suite: 'Suite 1',
      dataCriacao: new Date().toISOString().split('T')[0],
      observacoes: 'Observações do Caso de Teste 5',
      resultadoEsperado: 'Resultado Esperado do Caso de Teste 5',
      passos: 'Passos do Caso de Teste 5',
      preCondicoes: 'Pré-condições do Caso de Teste 5',
      posCondicoes: 'Pós-condições do Caso de Teste 5',
    },
  ];

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.idCaso = this.route.snapshot.params['idCaso'];
    this.isEdit = !!this.idCaso;

    this.casoDeTeste = this.mockupData[this.idCaso - 1];
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
        this.casoDeTeste?.prioridade || '',
        Validators.required
      ),
      complexidade: new FormControl(
        this.casoDeTeste?.complexidade || '',
        Validators.required
      ),
      tipo: new FormControl(this.casoDeTeste?.tipo || '', Validators.required),
      status: new FormControl(
        this.casoDeTeste?.status || '',
        Validators.required
      ),
      suite: new FormControl(this.casoDeTeste?.suite || ''),
      observacoes: new FormControl(this.casoDeTeste?.observacoes || ''),
      resultadoEsperado: new FormControl(
        this.casoDeTeste?.resultadoEsperado || '',
        Validators.required
      ),
      passos: new FormControl(
        this.casoDeTeste?.passos || '',
        Validators.required
      ),
    });

    this.casoDeTesteFormGroup.controls['prioridade'].setValue('Baixa');
    this.casoDeTesteFormGroup.controls['complexidade'].setValue('Baixa');
    this.casoDeTesteFormGroup.controls['tipo'].setValue('Funcional');
    this.casoDeTesteFormGroup.controls['status'].setValue('Ativo');
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

  get tipo() {
    return this.casoDeTesteFormGroup.get('tipo');
  }

  get status() {
    return this.casoDeTesteFormGroup.get('status');
  }

  get suite() {
    return this.casoDeTesteFormGroup.get('suite');
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

  get passos() {
    return this.casoDeTesteFormGroup.get('passos');
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
