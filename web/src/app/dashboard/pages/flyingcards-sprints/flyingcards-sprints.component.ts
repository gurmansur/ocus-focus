import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { GearIconComponent } from 'src/app/shared/icons/gear-icon/gear-icon.component';
import { SprintIconComponent } from 'src/app/shared/icons/sprint-icon/sprint-icon.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { ProjetoService } from '../../services/projeto.service';
import { FlyingcardsConfigureModalComponent } from './flyingcards-configure-modal/flyingcards-configure-modal.component';

@Component({
  selector: 'app-flyingcards-sprints',
  standalone: true,
  imports: [
    ProjectHeaderComponent,
    CdkDrag,
    CdkDropList,
    GearIconComponent,
    ButtonComponent,
    SprintIconComponent,
    FlyingcardsConfigureModalComponent,
  ],
  templateUrl: './flyingcards-sprints.component.html',
  styleUrl: './flyingcards-sprints.component.css',
})
export class FlyingcardsSprintsComponent {
  private projectId!: number;
  openConfigure: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjetoService
  ) {
    this.projectId = this.route.snapshot.params['id'];
  }

  todo = [
    'Fazer alguma coisa',
    'Fazendo alguma coisa',
    'Revisando alguma coisa',
    'Alguma coisa pronta',
  ];
  done: string[] = [];

  qtdTodo = 4;
  qtdDone = 0;

  timeTodo = 2 * this.qtdTodo;
  timeDone = 0;

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.qtdTodo = this.todo.length;
    this.qtdDone = this.done.length;
    this.timeTodo = 2 * this.qtdTodo;
    this.timeDone = 2 * this.qtdDone;
  }

  navigateToKanban() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-flyingcards',
    ]);
  }

  openConfigModal() {
    this.openConfigure = true;
  }

  closeConfigModal() {
    this.openConfigure = false;
  }

  runSprint() {}
}
