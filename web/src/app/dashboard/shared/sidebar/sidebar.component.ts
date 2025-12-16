import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() isExpanded!: boolean;
  @Output() closeMenuClick = new EventEmitter<boolean>();

  projetos: Projeto[] = [];
  userId!: number;
  user_role!: string;

  constructor(private projetoService: ProjetoService, private router: Router) {
    this.user_role = String(localStorage.getItem('usu_role'));
    this.userId = Number(localStorage.getItem('usu_id'));
  }

  onCloseClick(val: boolean) {
    this.closeMenuClick.emit(val);
  }

  ngOnInit() {
    this.projetoService
      .getProjetosRecentes(this.userId)
      .subscribe((projetos) => {
        this.projetos = projetos;
      });
  }

  navigateToProject(id: number) {
    location.href = '/dashboard/projeto/' + id;
  }

  navigateToProjects() {
    this.router.navigate(['/dashboard/projetos']);
  }

  navigateToHome() {
    this.router.navigate(['/dashboard']);
  }

  navigateToHelp() {
    this.router.navigate(['/dashboard/ajuda-manuais']);
  }
}
