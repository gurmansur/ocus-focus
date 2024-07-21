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
  planosDeTeste: PlanoDeTeste[] = [
    {
      id: 1,
      nome: 'Plano 1',
      data: '2021-09-01',
      descricao: 'Descrição da Plano 1',
      status: 'Ativo',
      observacoes: 'Observações da Plano 1',
    },
    {
      id: 2,
      nome: 'Plano 2',
      data: '2021-09-01',
      descricao: 'Descrição da Plano 2',
      status: 'Ativo',
      observacoes: 'Observações da Plano 2',
    },
    {
      id: 3,
      nome: 'Plano 3',
      data: '2021-09-01',
      descricao: 'Descrição da Plano 3',
      status: 'Inativo',
      observacoes: 'Observações da Plano 3',
    },
  ];
  suites: SuiteDeTeste[] = [
    {
      id: 1,
      nome: 'Suite 1',
      descricao: 'Descrição da Suite 1',
      status: 'Ativo',
      planoDeTeste: this.planosDeTeste[0],
      observacoes: 'Observações da Suite 1',
    },
    {
      id: 2,
      nome: 'Suite 2',
      descricao: 'Descrição da Suite 2',
      status: 'Ativo',
      planoDeTeste: this.planosDeTeste[1],
      observacoes: 'Observações da Suite 2',
    },
    {
      id: 3,
      nome: 'Suite 3',
      descricao: 'Descrição da Suite 3',
      status: 'Inativo',
      planoDeTeste: this.planosDeTeste[0],
      observacoes: 'Observações da Suite 3',
    },
  ];

  testadores: Colaborador[] = [
    {
      id: 1,
      nome: 'Colaborador 1',
      email: 'a@a.a',
      empresa: 'Empresa 1',
      cargo: 'Cargo 1',
    },
    {
      id: 2,
      nome: 'Colaborador 2',
      email: 'b@b.b',
      empresa: 'Empresa 2',
      cargo: 'Cargo 2',
    },
    {
      id: 3,
      nome: 'Colaborador 3',
      email: 'c@c.c',
      empresa: 'Empresa 3',
      cargo: 'Cargo 3',
    },
  ];

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
  casosDeUso: casoUso[] = [
    {
      id: 1,
      nome: 'Caso de Uso 1',
      descricao: 'Descrição do Caso de Uso 1',
      complexidade: EComplexidade.BAIXA,
    },
    {
      id: 2,
      nome: 'Caso de Uso 2',
      descricao: 'Descrição do Caso de Uso 2',
      complexidade: EComplexidade.BAIXA,
    },
    {
      id: 3,
      nome: 'Caso de Uso 3',
      descricao: 'Descrição do Caso de Uso 3',
      complexidade: EComplexidade.BAIXA,
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
      suite: new FormControl(this.casoDeTeste?.suite?.id || ''),
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
