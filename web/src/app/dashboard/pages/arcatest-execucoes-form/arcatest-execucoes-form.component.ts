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
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { CardComponent } from 'src/app/shared/card/card.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import {
  CasoDeTeste,
  ECategoria,
  EComplexidade,
  EPrioridade,
  EStatus,
  ETecnica,
} from '../../models/casoDeTeste';
import { ExecucaoTeste } from '../../models/execucaoTeste';

@Component({
  selector: 'app-arcatest-execucoes-form',
  standalone: true,
  templateUrl: './arcatest-execucoes-form.component.html',
  styleUrl: './arcatest-execucoes-form.component.css',
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
export class ArcatestExecucoesFormComponent {
  projectId!: number;
  idExec!: number;
  isEdit: boolean = false;
  execucaoFormGroup: any;
  formBuilder: FormBuilder = new FormBuilder();
  execucaoDeTeste?: ExecucaoTeste;
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
    this.idExec = this.route.snapshot.params['idExec'];
    this.isEdit = !!this.idExec;

    this.execucaoDeTeste = this.mockupData[this.idExec - 1];
  }

  ngOnInit(): void {
    this.execucaoFormGroup = this.formBuilder.group({
      nome: new FormControl(
        this.execucaoDeTeste?.nome || '',
        Validators.required
      ),
      data: new FormControl(
        this.execucaoDeTeste?.data || new Date().toISOString().split('T')[0],
        Validators.required
      ),
      hora: new FormControl(
        this.execucaoDeTeste?.hora ||
          new Date().toISOString().split('T')[1].split('.')[0],
        Validators.required
      ),
      casoDeTeste: new FormControl(
        this.execucaoDeTeste?.casoDeTeste.id || '',
        Validators.required
      ),
    });
  }

  navigateToArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
    ]);
  }

  navigateToTestExecutions() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'execucoes-teste',
    ]);
  }

  createTestExecution() {
    console.log(this.execucaoFormGroup.value);
  }

  get nome() {
    return this.execucaoFormGroup.get('nome');
  }

  get data() {
    return this.execucaoFormGroup.get('data');
  }

  get hora() {
    return this.execucaoFormGroup.get('hora');
  }

  get isFormValid() {
    return this.execucaoFormGroup.valid;
  }
}
