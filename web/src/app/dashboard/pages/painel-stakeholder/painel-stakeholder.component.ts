import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { PriorizacaoRequisito } from '../../models/priorizacaoRequisito';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';
import { RequisitoService } from '../../services/requisito.service';

@Component({
  selector: 'app-painel-stakeholder',
  templateUrl: './painel-stakeholder.component.html',
  styleUrls: ['./painel-stakeholder.component.css'],
})
export class PainelStakeholderComponent implements OnInit {
  userId: number;
  projeto: Projeto | null = null;
  isLoading: boolean = true;
  requisitos: PriorizacaoRequisito[] = [];

  constructor(
    private projetoService: ProjetoService,
    private requisitoService: RequisitoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private storageService: StorageService
  ) {
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

  // tabela
  colunasTabela: string[] = [
    'RF#',
    'Nome',
    'Resposta Positiva',
    'Resposta Negativa',
    'Classificação Requisito',
  ];

  camposEntidade: string[] = [
    'numeroIdentificador',
    'nome',
    'respostaPositiva',
    'respostaNegativa',
    'classificacaoRequisito',
  ];

  // formulario de busca
  filterValue: string = '';

  // paginação
  paginaAtual: number = 0;
  tamanhoPagina: number = 5;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  ngOnInit() {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }

    this.buscarProjeto(this.userId);
  }

  buscarProjeto(id: number) {
    this.isLoading = true;
    this.projetoService.findByIdStakeholder(id).subscribe({
      next: (projeto) => {
        this.projeto = projeto;
        if (projeto && projeto.id) {
          this.executarBusca(projeto.id);
        } else {
          console.error('Projeto retornado sem ID válido');
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Erro ao buscar projeto:', err);
        this.isLoading = false;
      },
    });
  }

  onSubmitSearch(event: Event): void {
    this.filterValue = (event.target as HTMLInputElement).value;
    if (this.projeto && this.projeto.id) {
      this.executarBusca(this.projeto.id);
    } else {
      console.error('Projeto não encontrado ou sem ID válido');
    }
  }

  private executarBusca(id: number): void {
    if (!this.filterValue) {
      this.requisitoService
        .listPriorizacaoStakeholder(
          id,
          this.userId,
          this.paginaAtual,
          this.tamanhoPagina
        )
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar requisitos:', err);
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.requisitoService
        .listPriorizacaoStakeholderByName(
          id,
          this.userId,
          this.filterValue,
          this.paginaAtual,
          this.tamanhoPagina
        )
        .subscribe({
          next: this.processarResultado(),
          error: (err) => {
            console.error('Erro ao buscar requisitos por nome:', err);
            this.isLoading = false;
          },
          complete: () => {
            this.isLoading = false;
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

  openPriorizacao() {
    if (!this.projeto || !this.projeto.id) {
      console.error(
        'Não é possível priorizar: Projeto não disponível ou sem ID'
      );
      return;
    }

    this.router.navigate([
      '/dashboard/priorizacao-stakeholder/',
      this.projeto.id,
    ]);
  }

  prevPage() {
    if (this.paginaAtual > 0 && this.projeto && this.projeto.id) {
      this.paginaAtual--;
      this.executarBusca(this.projeto.id);
    }
  }

  nextPage() {
    if (
      this.paginaAtual < this.totalPaginas - 1 &&
      this.projeto &&
      this.projeto.id
    ) {
      this.paginaAtual++;
      this.executarBusca(this.projeto.id);
    }
  }
}
