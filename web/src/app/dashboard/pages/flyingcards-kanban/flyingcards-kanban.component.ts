import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { GearIconComponent } from '../../../shared/icons/gear-icon/gear-icon.component';
import { Board } from '../../models/board';
import { Projeto } from '../../models/projeto';
import { UserStory } from '../../models/userStory';
import { KanbanService } from '../../services/kanban.service';
import { ProjetoService } from '../../services/projeto.service';
import { FlyingcardsTaskModalComponent } from '../painel-flyingcards/flyingcards-task-modal/flyingcards-task-modal.component';

@Component({
  selector: 'app-flyingcards-kanban',
  standalone: true,
  imports: [
    NgFor,
    ProjectHeaderComponent,
    CdkDrag,
    CdkDropList,
    CdkDropListGroup,
    PlusIconComponent,
    ButtonComponent,
    ModalComponent,
    GearIconComponent,
    FlyingcardsTaskModalComponent,
    CommonModule,
  ],
  templateUrl: './flyingcards-kanban.component.html',
  styleUrl: './flyingcards-kanban.component.css',
})
export class FlyingcardsKanbanComponent implements OnInit {
  private projectId!: number;
  project!: Projeto;
  userStories: UserStory[] = [];

  paginaAtual: number = 0;
  tamanhoPagina: number = 5;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjetoService,
    private kanbanService: KanbanService
  ) {
    this.projectId = this.route.snapshot.params['id'];
  }

  board: Board = new Board();

  buscarProjeto(id: number, user: number) {
    this.projectService.findById(id, user).subscribe((project) => {
      this.project = project;
    });
  }

  navigateToGeral() {
    this.router.navigate(['/dashboard/projeto/', this.projectId]);
  }

  navigateToCreateUserStory() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'kanban',
      'criar-us',
    ]);
  }

  navigateToCreateSwimlane() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'kanban',
      'swimlane',
      'new',
    ]);
  }

  navigateToEditSwimlane(swimlaneId: number) {
    console.log('clicou aqui');
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'kanban',
      'swimlane',
      'edit',
      swimlaneId,
    ]);
  }

  ngOnInit(): void {
    this.kanbanService
      .getBoardFromProject(this.projectId.toString())
      .subscribe(this.processarBoard());
  }

  async drop(event: CdkDragDrop<UserStory[]>) {
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

    this.board.swimlanes.map((swimlane) => {
      let usId: number[] = [];

      if (swimlane.userStories.length > 0) {
        usId =
          swimlane.userStories.map<number>((us) => {
            return us.id || -1;
          }) || [];
      }

      if (!usId) usId = [];

      this.kanbanService
        .updateUserStoriesInSwimlane({
          id: swimlane.id || -1,
          userStories: usId,
        })
        .subscribe();
    });
  }

  private processarBoard() {
    return (data: any) => {
      this.board = data;
    };
  }

  navigateToSprints() {
    this.router.navigate([
      'dashboard/projeto/',
      this.projectId,
      'kanban',
      'sprints',
    ]);
  }

  navigateToEditUserStory(usId: number = -1) {
    this.router.navigate([
      'dashboard/projeto/',
      this.projectId,
      'kanban',
      'editar-us',
      usId,
    ]);
  }
}
