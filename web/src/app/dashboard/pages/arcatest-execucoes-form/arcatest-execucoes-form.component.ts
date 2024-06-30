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
import { CasoDeTeste } from '../../models/casoDeTeste';
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
      status: new FormControl(
        this.execucaoDeTeste?.status || '',
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

  get status() {
    return this.execucaoFormGroup.get('status');
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
