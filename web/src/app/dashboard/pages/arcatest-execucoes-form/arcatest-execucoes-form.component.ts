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
  casosDeTeste: CasoDeTeste[] = [];

  mockupData: ExecucaoTeste[] = [];

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
