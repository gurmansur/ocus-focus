import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fatTecPro } from '../../models/fatTecPro';
import { Projeto } from '../../models/projeto';
import { FatTecProService } from '../../services/fatTecPro.service';
import { ProjetoService } from '../../services/projeto.service';

@Component({
  selector: 'app-fatores-tecnicos',
  templateUrl: './fatores-tecnicos.component.html',
  styleUrls: ['./fatores-tecnicos.component.css'],
})
export class FatoresTecnicosComponent {
  userId!: number;
  projetoId!: number;
  projeto!: Projeto;

  constructor(
    private projetoService: ProjetoService,
    private fatTecService: FatTecProService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.projetoId = this.route.snapshot.params['id'];
    this.userId = Number(localStorage.getItem('usu_id'));
  }

  // datasource
  fat: fatTecPro[] = [];

  // tabela
  colunasTabela: string[] = ['Descrição', 'Peso', 'Valor'];

  camposEntidade: string[] = ['descricao', 'peso', 'valor'];

  // formulario de busca
  filterValue: string = '';

  // paginação
  paginaAtual: number = 0;
  tamanhoPagina: number = 8;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  // diálogo de confirmação
  showModal: boolean = false;
  mostrarDialogoConfirmacao: boolean = false;
  itemExclusao!: number;
  tituloDialogo: string = 'Deseja realmente excluir este fator técnico?';
  mensagemDialogo: string =
    'Essa ação é irreversível. Todos os dados do fator técnico em questão serão excluídos do sistema.';

  ngOnInit() {
    this.buscarProjeto(this.projetoId, this.userId);
    this.executarBusca();
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe((projeto) => {
      this.projeto = projeto;
    });
  }

  private executarBusca(): void {
    this.fatTecService
      .list(this.projetoId, this.paginaAtual, this.tamanhoPagina)
      .subscribe(this.processarResultado());
  }

  private processarResultado() {
    return (data: any) => {
      this.fat = data.items;
      this.paginaAtual = data.page.number;
      this.tamanhoPagina = data.page.size;
      this.quantidadeElementos = data.page.totalElements;
      this.totalPaginas = data.page.totalPages;
    };
  }

  backToProjectHome() {
    this.router.navigate(['/dashboard/projeto/', this.projetoId]);
  }

  openNewFator() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projetoId,
      'inserir-fator-tecnico',
    ]);
  }

  excluirItem(item: any) {
    this.itemExclusao = item.id;
    this.showModal = true;
    this.mostrarDialogoConfirmacao = true;
  }

  editarItem(item: any) {
    console.log(item);
    this.router.navigate([
      '/dashboard/projeto/',
      this.projetoId,
      'editar-fator-tecnico',
      item.id,
    ]);
  }

  cancelarExclusao() {
    this.showModal = false;
    this.mostrarDialogoConfirmacao = false;
  }

  confirmarExclusao() {
    this.fatTecService.delete(this.itemExclusao).subscribe(() => {
      this.showModal = false;
      this.mostrarDialogoConfirmacao = false;
      this.executarBusca();
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
}
