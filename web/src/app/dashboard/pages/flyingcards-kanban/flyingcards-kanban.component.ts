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
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { ContentModalComponent } from 'src/app/shared/content-modal/content-modal.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { GearIconComponent } from '../../../shared/icons/gear-icon/gear-icon.component';
import { Board } from '../../models/board';
import { Projeto } from '../../models/projeto';
import { Sprint } from '../../models/sprint';
import { UserStory } from '../../models/userStory';
import { KanbanService } from '../../services/kanban.service';
import { ProjetoService } from '../../services/projeto.service';
import { SprintService } from '../../services/sprint.service';
import { FlyingcardsUserstoryComponent } from '../flyingcards-userstory/flyingcards-userstory.component';
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
    ContentModalComponent,
    GearIconComponent,
    FlyingcardsTaskModalComponent,
    CommonModule,
    FlyingcardsUserstoryComponent,
    FormsModule,
  ],
  templateUrl: './flyingcards-kanban.component.html',
  styleUrl: './flyingcards-kanban.component.css',
})
export class FlyingcardsKanbanComponent implements OnInit {
  projectId!: number;
  project!: Projeto;
  userStories: UserStory[] = [];
  sprints: Sprint[] = [];
  activeSprint: Sprint | null = null;

  paginaAtual: number = 0;
  tamanhoPagina: number = 5;
  quantidadeElementos: number = 0;
  totalPaginas: number = 0;

  // Detail modal state
  showDetailModal = false;
  selectedUserStory: UserStory | null = null;
  selectedUserStoryRequirements: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjetoService,
    private kanbanService: KanbanService,
    private sprintService: SprintService,
  ) {
    this.projectId = this.route.snapshot.params['id'];

    this.route.queryParamMap.subscribe((params) => {
      const usParam = params.get('usId');
      const parsed = usParam ? Number(usParam) : NaN;
      this.pendingUserStoryId =
        Number.isFinite(parsed) && parsed > 0 ? parsed : null;
      this.tryOpenPendingUserStory();
    });
  }

  board: Board = new Board();
  private pendingUserStoryId: number | null = null;

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
    this.loadSprints();
  }

  private loadSprints(): void {
    this.sprintService.findByProject(this.projectId).subscribe({
      next: (sprints: Sprint[]) => {
        this.sprints = sprints;
        if (sprints.length > 0 && !this.activeSprint) {
          this.activeSprint = sprints[0];
          this.loadBoard();
        } else if (this.sprints.length === 0) {
          // No sprints, load board without sprint filter
          this.loadBoard();
        }
      },
    });
  }

  private loadBoard(): void {
    this.kanbanService
      .getBoardFromProject(this.projectId.toString(), this.activeSprint?.id)
      .subscribe(this.processarBoard());
  }

  onSelectSprint(sprint: Sprint): void {
    this.activeSprint = sprint;
    this.loadBoard();
  }

  async drop(event: CdkDragDrop<UserStory[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
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
      this.tryOpenPendingUserStory();
    };
  }

  private tryOpenPendingUserStory() {
    if (!this.pendingUserStoryId || !this.board.swimlanes) return;

    const targetId = this.pendingUserStoryId;
    for (const swimlane of this.board.swimlanes) {
      for (const us of swimlane.userStories || []) {
        if (us.id === targetId) {
          this.openUserStoryDetails(us);
          this.pendingUserStoryId = null;
          return;
        }
      }
    }
  }

  openUserStoryDetails(userStory: UserStory) {
    this.selectedUserStory = userStory;
    // Extract requirements from the user story if they exist
    this.selectedUserStoryRequirements = userStory['requisitos'] || [];
    this.showDetailModal = true;
  }

  closeDetailModal() {
    this.showDetailModal = false;
    this.selectedUserStory = null;
    this.selectedUserStoryRequirements = [];
  }

  onEditUserStory() {
    if (this.selectedUserStory && this.selectedUserStory.id != null) {
      this.navigateToEditUserStory(this.selectedUserStory.id);
    }
  }

  onDeleteUserStory() {
    if (!this.selectedUserStory || this.selectedUserStory.id == null) return;

    const id = this.selectedUserStory.id;
    this.kanbanService.deletarUserStory(id).subscribe({
      next: () => {
        // Refresh board after deletion and close modal
        this.loadBoard();
        this.closeDetailModal();
      },
    });
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
