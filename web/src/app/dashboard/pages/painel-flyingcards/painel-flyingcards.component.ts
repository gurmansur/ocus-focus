import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClickableCardComponent } from 'src/app/shared/clickable-card/clickable-card.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { TableComponent } from 'src/app/shared/table/table.component';
import { ExecutionIconComponent } from '../painel-arcatest/components/execution-icon/execution-icon.component';
import { TestCaseIconComponent } from '../painel-arcatest/components/test-case-icon/test-case-icon.component';
import { TestPlanIconComponent } from '../painel-arcatest/components/test-plan-icon/test-plan-icon.component';
import { TestSuiteIconComponent } from '../painel-arcatest/components/test-suite-icon/test-suite-icon.component';

@Component({
  selector: 'app-painel-flyingcards',
  standalone: true,
  imports: [
    ProjectHeaderComponent,
    TableComponent,
    ClickableCardComponent,
    ExecutionIconComponent,
    TestCaseIconComponent,
    TestSuiteIconComponent,
    TestPlanIconComponent,
  ],
  templateUrl: './painel-flyingcards.component.html',
  styleUrl: './painel-flyingcards.component.css',
})
export class PainelFlyingcardsComponent {
  userId!: number;
  projectId!: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.projectId = this.route.snapshot.params['id'];
    this.userId = Number(localStorage.getItem('usu_id'));
  }

  navigateToKanban() {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'kanban']);
  }
  navigateToSprints() {
    this.router.navigate(['dashboard/projeto/', this.projectId, 'sprints']);
  }

  navigateToHome() {
    this.router.navigate(['/dashboard/projeto/', this.projectId]);
  }
}
