import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/button/button.component';
import { PlusIconComponent } from '../../../shared/icons/plus-icon/plus-icon.component';
import { ProjectHeaderComponent } from '../../../shared/project-header/project-header.component';
import { TableComponent } from '../../../shared/table/table.component';

@Component({
  selector: 'app-arcatest-casos',
  standalone: true,
  templateUrl: './arcatest-casos.component.html',
  styleUrl: './arcatest-casos.component.css',
  imports: [
    ProjectHeaderComponent,
    TableComponent,
    ButtonComponent,
    PlusIconComponent,
  ],
})
export class ArcatestCasosComponent {
  projectId!: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
  }

  navigateToArcaTest() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-arcatest',
    ]);
  }

  navigateToCreateTestCase() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'casos-teste',
      'criar',
    ]);
  }

  navigateToEditTestCase(id: number) {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'casos-teste',
      id,
      'editar',
    ]);
  }
}
