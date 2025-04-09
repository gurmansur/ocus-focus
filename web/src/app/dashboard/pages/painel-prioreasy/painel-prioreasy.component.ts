import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Projeto } from '../../models/projeto';
import { ResultadoRequisito } from '../../models/resultadoRequisito';
import { PriorizacaoService } from '../../services/priorizacao.service';
import { ProjetoService } from '../../services/projeto.service';
import { RequisitoService } from '../../services/requisito.service';
import { StakeholderService } from '../../services/stakeholder.service';

@Component({
  selector: 'app-painel-prioreasy',
  templateUrl: './painel-prioreasy.component.html',
  styleUrls: ['./painel-prioreasy.component.css'],
})
export class PainelPrioreasyComponent implements OnInit {
  userId: number = 0;
  projetoId!: number;
  projeto!: Projeto;

  constructor(
    private projetoService: ProjetoService,
    private requisitoService: RequisitoService,
    private stakeholderService: StakeholderService,
    private priorizacaoService: PriorizacaoService,
    private router: Router,
    private route: ActivatedRoute,
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

  // datasource
  requisitos: ResultadoRequisito[] = [];

  // tabela
  colunasTabela: string[] = ['RF#', 'Nome', 'Resultado Final'];

  camposEntidade: string[] = ['numeroIdentificador', 'nome', 'resultadoFinal'];

  // formulario de busca
  filterValue: string = '';

  // paginação
  paginaAtual: number = 0;
  tamanhoPagina: number = 5;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  // modal confirmação
  tituloConfirmacao =
    'Deseja realmente efetuar a geração dos resultados do projeto?';
  mensagemConfirmacao =
    'Ao confirmar, os resultados serão gerados e não poderão ser alterados.';
  showModalConfirmacao: boolean = false;

  // modal mensagem
  tituloMensagem = 'Erro!';
  mensagemMensagem =
    'Nem todos os stakeholders participaram da priorização. Aguarde a participação de todos para gerar os resultados.';
  showModalMensagem: boolean = false;

  showModal: boolean = false;
  mostrarDialogoConfirmacao: boolean = false;
  tituloDialogo: string = 'Confirmar operação';
  mensagemDialogo: string = 'Tem certeza que deseja realizar esta operação?';

  ngOnInit() {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }

    this.buscarProjeto(this.projetoId, this.userId);
    this.executarBusca();
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe({
      next: (projeto) => {
        this.projeto = projeto;
      },
      error: (err) => {
        console.error('Erro ao buscar projeto:', err);
      },
    });
  }

  onSubmitSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    this.executarBusca();
  }

  private executarBusca(): void {
    if (!this.filterValue) {
      this.requisitoService
        .listResultado(this.projetoId, this.paginaAtual, this.tamanhoPagina)
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar resultados:', err);
          },
        });
    } else {
      this.requisitoService
        .listResultadoByName(
          this.projetoId,
          this.filterValue,
          this.paginaAtual,
          this.tamanhoPagina
        )
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar resultados por nome:', err);
          },
        });
    }
  }

  private processarResultado() {
    return (data: any) => {
      this.requisitos = data.items;
      this.paginaAtual = data.page.number;
      this.tamanhoPagina = data.page.size;
      this.quantidadeElementos = data.page.totalElements;
      this.totalPaginas = data.page.totalPages;
    };
  }

  openProjectHome() {
    this.router.navigate(['/dashboard/projeto/', this.projetoId]);
  }

  openStakeholders() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projetoId,
      'stakeholders',
    ]);
  }

  openPriorizacao() {
    this.showModalConfirmacao = true;
  }

  cancelarPriorizacao() {
    this.showModalConfirmacao = false;
  }

  fecharMensagem() {
    this.showModalMensagem = false;
  }

  confirmarPriorizacao() {
    this.stakeholderService.verifyParticipation(this.projetoId).subscribe({
      next: () => {
        // Usar promessas para controlar o fluxo de requisições
        const processarRequisitos = async () => {
          try {
            for (const requisito of this.requisitos) {
              const response = await this.priorizacaoService
                .getRequirementFinalClassification(requisito.id || 0)
                .toPromise();

              if (response && response.length > 0) {
                const classificacaoFinal =
                  response[0].PRS_CLASSIFICACAO_REQUISITO;

                await this.priorizacaoService
                  .insertResultadoClassificacao(
                    requisito.id || 0,
                    classificacaoFinal
                  )
                  .toPromise();
              }
            }

            this.executarBusca();
            this.showModalConfirmacao = false;
          } catch (error) {
            console.error('Erro ao processar resultados:', error);
            this.showModalConfirmacao = false;
            this.showModalMensagem = true;
          }
        };

        processarRequisitos();
      },
      error: (err) => {
        console.error('Erro na verificação de participação:', err);
        this.showModalConfirmacao = false;
        this.showModalMensagem = true;
      },
    });
  }

  prevPage() {
    if (this.paginaAtual > 0) {
      this.paginaAtual--;
      this.executarBusca();
    }
  }

  nextPage() {
    if (this.paginaAtual < this.totalPaginas - 1) {
      this.paginaAtual++;
      this.executarBusca();
    }
  }

  // Métodos para o diálogo de confirmação
  cancelarExclusao() {
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;
  }

  confirmarExclusao() {
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;
    // Implementação necessária para esta operação
  }
}
