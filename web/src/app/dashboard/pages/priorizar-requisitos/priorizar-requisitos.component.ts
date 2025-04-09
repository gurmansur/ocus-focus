import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';
import { RequisitoService } from '../../services/requisito.service';
import { PriorizacaoRequisito } from '../../models/priorizacaoRequisito';
import calcularResultadoFinal from '../../utils/calcularResultadoFinal';
import { PriorizacaoService } from '../../services/priorizacao.service';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';

@Component({
  selector: 'app-priorizar-requisitos',
  templateUrl: './priorizar-requisitos.component.html',
  styleUrls: ['./priorizar-requisitos.component.css'],
})
export class PriorizarRequisitosComponent {
  priorizacaoFormGroup!: FormGroup;
  projeto!: Projeto;
  projetoId!: number;
  userId!: number;
  requisitoId!: number;

  requisitoAtual!: PriorizacaoRequisito;
  indiceAtual!: number;
  requisitoList!: PriorizacaoRequisito[];
  classificacaoFinalAtual!: string | undefined;

  tituloDialogo: string = 'Completar priorização de requisitos?';
  mensagemDialogo: string =
    'Ao completar a priorização de requisitos, você não poderá mais alterar as respostas. Deseja continuar?';
  showModal: boolean = false;
  mostrarDialogoConfirmacao: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private projetoService: ProjetoService,
    private requisitoService: RequisitoService,
    private priorizacaoService: PriorizacaoService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService
  ) {
    this.projetoId = this.route.snapshot.params['id'];
    
    // Get user ID from AuthService or StorageService as fallback
    const userData = this.authService.getUserData();
    if (userData && userData.id) {
      this.userId = Number(userData.id);
    } else {
      // Fallback to StorageService
      const storedId = this.storageService.getItem('usu_id');
      this.userId = storedId ? Number(storedId) : 0;
    }
  }

  ngOnInit(): void {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }
    
    this.priorizacaoFormGroup = this.formBuilder.group({
      numeroIdentificador: new FormControl('', [
        Validators.required,
        Validators.min(1),
      ]),

      nome: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
      ]),

      especificacao: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(1000),
      ]),

      respostaPositiva: new FormControl('', [Validators.required]),

      respostaNegativa: new FormControl('', [Validators.required]),
    });

    this.buscarProjeto(this.projetoId, this.userId);
    this.getRequisitoList();
  }

  atualizarForm() {
    this.priorizacaoFormGroup.controls['nome'].setValue(
      this.requisitoAtual.nome
    );
    this.priorizacaoFormGroup.controls['especificacao'].setValue(
      this.requisitoAtual.especificacao
    );
    this.priorizacaoFormGroup.controls['numeroIdentificador'].setValue(
      this.requisitoAtual.numeroIdentificador
    );

    this.priorizacaoFormGroup.controls['respostaPositiva'].setValue(
      this.requisitoAtual.respostaPositiva
    );
    this.priorizacaoFormGroup.controls['respostaNegativa'].reset(
      this.requisitoAtual.respostaNegativa
    );
  }

  getRequisitoList() {
    this.requisitoService
      .listRequisitosPriorizacaoStakeholder(this.projetoId)
      .subscribe({
        next: (requisitos) => {
          if (requisitos.items && requisitos.items.length > 0) {
            this.requisitoAtual = requisitos.items[0];
            this.indiceAtual = 0;
            this.requisitoList = requisitos.items;
            this.atualizarForm();
          } else {
            console.warn('Nenhum requisito encontrado para priorização');
          }
        },
        error: (error) => {
          console.error('Erro ao buscar requisitos:', error);
        }
      });
  }

  backToProjectHome() {
    this.router.navigate(['/dashboard/painel-stakeholder']);
  }

  backToPrevious() {
    this.indiceAtual--;
    this.requisitoAtual = this.requisitoList[this.indiceAtual];
    this.atualizarForm();
  }

  goToNext() {
    if (this.priorizacaoFormGroup.invalid) {
      this.priorizacaoFormGroup.markAllAsTouched();
      return;
    } else {
      this.classificacaoFinalAtual = calcularResultadoFinal(
        this.respostaPositiva!.value,
        this.respostaNegativa!.value
      );
      this.requisitoAtual = this.newPriorizacaoRequisito();
      this.requisitoList[this.indiceAtual] = this.requisitoAtual;

      this.indiceAtual++;
      this.requisitoAtual = this.requisitoList[this.indiceAtual];

      this.atualizarForm();
    }
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe({
      next: (projeto) => {
        this.projeto = projeto;
      },
      error: (err) => {
        console.error('Erro ao buscar projeto:', err);
      }
    });
  }

  get nome() {
    return this.priorizacaoFormGroup.get('nome');
  }
  get especificacao() {
    return this.priorizacaoFormGroup.get('especificacao');
  }
  get numeroIdentificador() {
    return this.priorizacaoFormGroup.get('numeroIdentificador');
  }
  get respostaPositiva() {
    return this.priorizacaoFormGroup.get('respostaPositiva');
  }
  get respostaNegativa() {
    return this.priorizacaoFormGroup.get('respostaNegativa');
  }

  newPriorizacaoRequisito(): PriorizacaoRequisito {
    return new PriorizacaoRequisito(
      this.nome!.value,
      this.especificacao!.value,
      this.numeroIdentificador!.value,
      this.respostaPositiva!.value,
      this.respostaNegativa!.value,
      this.classificacaoFinalAtual!,
      this.requisitoAtual.id
    );
  }

  onSubmit() {
    if (this.priorizacaoFormGroup.invalid) {
      this.priorizacaoFormGroup.markAllAsTouched();
      return;
    } else {
      // Save the final requisito
      this.classificacaoFinalAtual = calcularResultadoFinal(
        this.respostaPositiva!.value,
        this.respostaNegativa!.value
      );
      this.requisitoAtual = this.newPriorizacaoRequisito();
      this.requisitoList[this.indiceAtual] = this.requisitoAtual;
      
      // Show the confirmation dialog
      this.showModal = true;
      this.mostrarDialogoConfirmacao = true;
    }
  }

  cancelarExclusao() {
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;
  }

  confirmarExclusao() {
    this.finalizar();
  }

  finalizar() {
    if (this.isSubmitting) {
      return; // Prevent double submission
    }
    
    this.isSubmitting = true;
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;

    let completed = 0;
    const total = this.requisitoList.length;
    
    for (const requisito of this.requisitoList) {
      this.priorizacaoService
        .insertPriorizacao(
          {
            requisito: requisito.id || 0,
            respostaPositiva: requisito.respostaPositiva,
            respostaNegativa: requisito.respostaNegativa,
            classificacaoRequisito: requisito.classificacaoRequisito,
          },
          this.userId
        )
        .subscribe({
          next: () => {
            completed++;
            // Only complete when all are done
            if (completed === total) {
              this.priorizacaoService
                .completePriorizacao(this.userId)
                .subscribe({
                  next: () => {
                    this.router.navigate(['/dashboard/painel-stakeholder']);
                  },
                  error: (err) => {
                    console.error('Erro ao completar priorização:', err);
                    this.isSubmitting = false;
                  }
                });
            }
          },
          error: (err) => {
            console.error('Erro ao inserir priorização:', err);
            this.isSubmitting = false;
          }
        });
    }
  }
}
