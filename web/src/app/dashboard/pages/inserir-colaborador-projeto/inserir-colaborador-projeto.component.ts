import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { StorageService } from '../../../shared/services/storage.service';
import { Colaborador } from '../../models/colaborador';
import { Projeto } from '../../models/projeto';
import { ColaboradorService } from '../../services/colaborador.service';
import { ProjetoService } from '../../services/projeto.service';

@Component({
  selector: 'app-inserir-colaborador-projeto',
  templateUrl: './inserir-colaborador-projeto.component.html',
  styleUrls: ['./inserir-colaborador-projeto.component.css'],
})
export class InserirColaboradorProjetoComponent implements OnInit {
  userId: number = 0;
  projetoId!: number;
  projeto!: Projeto;

  colaboradores: Colaborador[] = [];
  selectedColaborador!: Colaborador;

  constructor(
    private projetoService: ProjetoService,
    private colaboradorService: ColaboradorService,
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

  // formulario de busca
  filterValue: string = '';

  ngOnInit() {
    if (this.userId === 0) {
      console.error('ID de usuário não encontrado');
      this.router.navigate(['/']);
      return;
    }

    this.buscarProjeto(this.projetoId, this.userId);
    this.executarBusca();
  }

  backToProjectHome() {
    this.router.navigate(['/dashboard/projeto/', this.projetoId]);
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

  executarBusca() {
    this.colaboradorService
      .findByNome(this.filterValue, this.projetoId)
      .subscribe({
        next: (colaboradores) => {
          this.colaboradores = colaboradores;
        },
        error: (err) => {
          console.error('Erro ao buscar colaboradores:', err);
        },
      });
  }

  selectColaborador(colaborador: Colaborador) {
    this.selectedColaborador = colaborador;
  }

  addColaborador() {
    if (!this.selectedColaborador) {
      console.error('Nenhum colaborador selecionado');
      return;
    }

    this.projetoService
      .addColaborador(this.projetoId, this.selectedColaborador.id!)
      .subscribe({
        next: () => {
          this.router.navigate([
            `/dashboard/projeto/${this.projetoId}/colaboradores`,
          ]);
        },
        error: (err) => {
          console.error('Erro ao adicionar colaborador:', err);
        },
      });
  }
}
