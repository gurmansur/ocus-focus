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
import { ExecucaoDeTeste } from '../../models/execucaoDeTeste';
import { CasoDeTesteService } from '../../services/casoDeTeste.service';
import { ExecucaoDeTesteService } from '../../services/execucoesDeTeste.service';

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
  execucaoDeTeste?: ExecucaoDeTeste;
  casosDeTeste: CasoDeTeste[] = [];

  execucoes: ExecucaoDeTeste[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private execucaoDeTesteService: ExecucaoDeTesteService,
    private casoDeTesteService: CasoDeTesteService,
  ) {
    this.projectId = this.route.parent?.snapshot.params['id'];
    this.idExec = this.route.snapshot.params['idExec'];
    this.isEdit = !!this.idExec;

    this.getCasosDeTeste();

    if (this.isEdit) {
      this.getExecucao();
    }

    this.execucaoFormGroup = this.formBuilder.group({
      nome: new FormControl(
        this.execucaoDeTeste?.nome || '',
        Validators.required,
      ),
      data: new FormControl(
        this.execucaoDeTeste?.dataExecucao.split('T')[0] ||
          new Date().toISOString().split('T')[0],
        Validators.required,
      ),
      hora: new FormControl(
        this.execucaoDeTeste?.dataExecucao.split('T')[1].split('.')[0] ||
          new Date().toISOString().split('T')[1].split('.')[0],
        Validators.required,
      ),
      casoDeTeste: new FormControl(
        this.execucaoDeTeste?.casoDeTeste.id || '',
        Validators.required,
      ),
    });
  }

  getExecucao() {
    this.execucaoDeTesteService.getById(this.idExec).subscribe({
      next: (execucao: ExecucaoDeTeste) => {
        this.execucaoDeTeste = execucao;
        this.createFormGroup();
      },
    });
  }

  getCasosDeTeste() {
    this.casoDeTesteService.getAll().subscribe({
      next: (casosDeTeste) => {
        this.casosDeTeste = casosDeTeste;
      },
    });
  }

  createFormGroup() {
    this.execucaoFormGroup = this.formBuilder.group({
      nome: new FormControl(
        this.execucaoDeTeste?.nome || '',
        Validators.required,
      ),
      data: new FormControl(
        this.execucaoDeTeste?.dataExecucao
          ? new Date(this.execucaoDeTeste.dataExecucao)
              .toISOString()
              .split('T')[0]
          : new Date().toISOString().split('T')[0],
        Validators.required,
      ),
      hora: new FormControl(
        this.execucaoDeTeste?.dataExecucao
          ? new Date(this.execucaoDeTeste.dataExecucao).toLocaleTimeString(
              'pt-BR',
              { hour12: false },
            )
          : new Date().toLocaleTimeString('pt-BR', { hour12: false }),
        Validators.required,
      ),
      casoDeTeste: new FormControl(
        this.execucaoDeTeste?.casoDeTeste.id || '',
        Validators.required,
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
      'painel-arcatest',
      'execucoes',
    ]);
  }

  createTestExecution() {
    this.execucaoDeTesteService
      .create({
        ...this.execucaoFormGroup.value,
        dataExecucao: new Date(`${this.data.value}T${this.hora.value}`),
        casoDeTesteId: this.execucaoFormGroup.get('casoDeTeste').value,
      })
      .subscribe({
        next: () => {
          this.navigateToTestExecutions();
        },
      });
  }

  updateTestExecution() {
    this.execucaoDeTesteService
      .update(this.idExec, {
        ...this.execucaoFormGroup.value,
        dataExecucao: new Date(`${this.data.value}T${this.hora.value}`),
        casoDeTesteId: this.execucaoFormGroup.get('casoDeTeste').value,
      })
      .subscribe({
        next: () => {
          this.navigateToTestExecutions();
        },
      });
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
