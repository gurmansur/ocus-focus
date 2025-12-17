import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projeto } from 'src/app/dashboard/models/projeto';
import { ProjetoService } from 'src/app/dashboard/services/projeto.service';

@Component({
  selector: 'app-project-header',
  standalone: true,
  imports: [],
  templateUrl: './project-header.component.html',
  styleUrl: './project-header.component.css',
})
export class ProjectHeaderComponent {
  userId!: number;
  projectId!: number;
  projeto!: Projeto;
  @Input() voltar = 'Voltar ao Início';
  @Output() onBack = new EventEmitter<void>();

  constructor(
    private projetoService: ProjetoService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.projectId = this.route.snapshot.params['id'];
    this.userId = Number(localStorage.getItem('usu_id'));
  }

  ngOnInit() {
    this.buscarProjeto(this.projectId, this.userId);
  }

  buscarProjeto(id: number, user: number) {
    this.projetoService.findById(id, user).subscribe((projeto) => {
      this.projeto = projeto;
    });
  }
  openProjectHome() {
    this.onBack.emit();
  }
  openAtores() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'atores']);
  }
}
