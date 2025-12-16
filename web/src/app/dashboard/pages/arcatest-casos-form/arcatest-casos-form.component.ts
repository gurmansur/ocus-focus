import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
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
import { ContentModalComponent } from '../../../shared/content-modal/content-modal.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { ExecucaoDeTesteService } from '../../../shared/services/execucao-de-teste.service';
import {
  CasoDeTeste,
  ECategoria,
  EComplexidade,
  EPrioridade,
  ETecnica,
} from '../../models/casoDeTeste';
import { casoUso } from '../../models/casoUso';
import { Colaborador } from '../../models/colaborador';
import { PlanoDeTeste } from '../../models/planoDeTeste';
import { SuiteDeTeste } from '../../models/suiteDeTeste';
import { CasoDeTesteService } from '../../services/casoDeTeste.service';
import { CasoUsoService } from '../../services/casoUso.service';
import { ProjetoService } from '../../services/projeto.service';
import { AcoesAutomatizadasComponent } from '../acoes-automatizadas/acoes-automatizadas.component';
import { TestExecutionModalComponent } from '../shared/test-execution-modal/test-execution-modal.component';

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
    AcoesAutomatizadasComponent,
    ContentModalComponent,
    TestExecutionModalComponent,
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
  executando = false;
  showModal = false;
  log: { type: 'text' | 'image'; content: string }[] = [];
  resultado?: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly casoDeTesteService: CasoDeTesteService,
    private readonly casoDeUsoService: CasoUsoService,
    private readonly projetoService: ProjetoService,
    private readonly execService: ExecucaoDeTesteService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.projectId = this.route.parent?.snapshot.params['id'];
    this.idCaso = this.route.snapshot.params['idCaso'];
    this.isEdit = !!this.idCaso;

    this.getCasosDeUso();
    this.getColaboradores();
  }

  navigateToArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
    ]);
  }

  getCasosDeUso() {
    this.casoDeUsoService.list().subscribe({
      next: (casos) => {
        this.casosDeUso = casos.items;
      },
    });
  }

  getColaboradores() {
    this.projetoService.getColaboradoresByProjeto(this.projectId).subscribe({
      next: (colaboradores) => {
        this.testadores = colaboradores.items;
      },
    });
  }

  createTestCase() {
    this.casoDeTesteService.create(this.casoDeTesteFormGroup.value).subscribe({
      next: () => {
        this.navigateToTestCases();
      },
    });
  }

  updateTestCase() {
    this.casoDeTesteService
      .update(this.idCaso, this.casoDeTesteFormGroup.value)
      .subscribe({
        next: () => {
          this.navigateToArcaTest();
        },
      });
  }

  getCase() {
    this.casoDeTesteService.getById(this.idCaso).subscribe({
      next: (caso) => {
        this.casoDeTeste = caso;
        this.createFormGroup();
      },
    });
  }

  createFormGroup() {
    this.casoDeTesteFormGroup = this.formBuilder.group({
      nome: new FormControl(this.casoDeTeste?.nome || '', Validators.required),
      descricao: new FormControl(
        this.casoDeTeste?.descricao || '',
        Validators.required
      ),
      preCondicao: new FormControl(this.casoDeTeste?.preCondicao || ''),
      posCondicao: new FormControl(this.casoDeTeste?.posCondicao || ''),
      prioridade: new FormControl(
        this.casoDeTeste?.prioridade || EPrioridade.BAIXA,
        Validators.required
      ),
      complexidade: new FormControl(
        this.casoDeTeste?.complexidade || EComplexidade.SIMPLES,
        Validators.required
      ),
      tecnica: new FormControl(
        this.casoDeTeste?.tecnica || ETecnica.FUNCIONAL,
        Validators.required
      ),
      metodo: new FormControl(
        this.casoDeTeste?.metodo || ECategoria.MANUAL,
        Validators.required
      ),
      suiteDeTesteId: this.route.snapshot.queryParams['suiteId'] || '',
      testadorDesignadoId: new FormControl(
        this.casoDeTeste?.testadorDesignado?.id || ''
      ),
      observacoes: new FormControl(this.casoDeTeste?.observacoes || ''),
      resultadoEsperado: new FormControl(
        this.casoDeTeste?.resultadoEsperado || '',
        Validators.required
      ),
      dadosEntrada: new FormControl(
        this.casoDeTeste?.dadosEntrada || '',
        Validators.required
      ),
      casoDeUsoId: new FormControl(this.casoDeTeste?.casoDeUso?.id || ''),
    });
  }

  ngOnInit() {
    if (this.isEdit) {
      this.getCase();
    }
    this.createFormGroup();
  }

  get nome() {
    return this.casoDeTesteFormGroup.get('nome');
  }

  get descricao() {
    return this.casoDeTesteFormGroup.get('descricao');
  }

  get preCondicao() {
    return this.casoDeTesteFormGroup.get('preCondicao');
  }

  get posCondicao() {
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
      'painel-arcatest',
      'arvore',
    ]);
  }

  executarTeste() {
    if (!this.idCaso) return;

    this.executando = true;
    this.showModal = true;
    this.log = [];
    this.resultado = null;

    console.log('[Component] Starting test execution for case:', this.idCaso);

    this.execService.executarComStream(this.idCaso).subscribe({
      next: (event) => {
        console.log('[Component] Event received:', event);
        this.ngZone.run(() => {
          console.log(
            '[Component] Processing in NgZone, current log length:',
            this.log.length
          );
          if (event.type === 'log' || event.type === 'start') {
            this.log = [...this.log, { type: 'text', content: event.message }];
            console.log(
              '[Component] Added log entry, new length:',
              this.log.length
            );
          } else if (event.type === 'image') {
            this.log = [...this.log, { type: 'image', content: event.src }];
            console.log(
              '[Component] Added image entry, new length:',
              this.log.length
            );
          } else if (event.type === 'complete') {
            this.resultado = event;
            this.log = [
              ...this.log,
              {
                type: 'text',
                content: `✓ Execução concluída: ${
                  event.sucesso ? 'SUCESSO' : 'FALHA'
                }`,
              },
            ];
            this.executando = false;
            console.log('[Component] Execution complete');
          } else if (event.type === 'error') {
            this.log = [
              ...this.log,
              {
                type: 'text',
                content: `✗ Erro: ${event.message}`,
              },
            ];
            this.executando = false;
            console.log('[Component] Execution error');
          }
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        console.error('[Component] Stream error:', err);
        this.ngZone.run(() => {
          this.log = [
            ...this.log,
            {
              type: 'text',
              content: `✗ Erro de conexão: ${
                err.message || 'Erro desconhecido'
              }`,
            },
          ];
          this.executando = false;
          this.cdr.markForCheck();
        });
      },
    });
  }

  closeExecuteModal() {
    this.showModal = false;
    this.log = [];
    this.executando = false;
  }
}
