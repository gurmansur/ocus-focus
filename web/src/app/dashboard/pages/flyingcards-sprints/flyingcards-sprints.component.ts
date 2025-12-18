import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { GearIconComponent } from 'src/app/shared/icons/gear-icon/gear-icon.component';
import { SprintIconComponent } from 'src/app/shared/icons/sprint-icon/sprint-icon.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { Sprint } from '../../models/sprint';
import { UserStory } from '../../models/userStory';
import { ProjetoService } from '../../services/projeto.service';
import { SprintService } from '../../services/sprint.service';
import { UserStoryService } from '../../services/user-story.service';
import { FlyingcardsConfigureModalComponent } from './flyingcards-configure-modal/flyingcards-configure-modal.component';

@Component({
  selector: 'app-flyingcards-sprints',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
export class FlyingcardsSprintsComponent implements OnInit {
  private projectId!: number;
  openConfigure: boolean = false;
  sprints: Sprint[] = [];
  activeSprint: Sprint | null = null;
  allUserStories: UserStory[] = [];
  sprintUserStories: UserStory[] = [];
  backlogUserStories: UserStory[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjetoService,
    private sprintService: SprintService,
    private userStoryService: UserStoryService,
  ) {
    this.projectId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // Load sprints and user stories in parallel
    this.sprintService.findAll().subscribe({
      next: (sprints: Sprint[]) => {
        this.sprints = sprints;
        if (this.sprints.length > 0 && !this.activeSprint) {
          this.activeSprint = this.sprints[0];
        }
        this.loadUserStories();
      },
      error: (error) => {
        console.error('Erro ao carregar sprints:', error);
      },
    });
  }

  loadUserStories(): void {
    // Load all user stories for the project
    this.userStoryService.findByProject(this.projectId).subscribe({
      next: (userStories: UserStory[]) => {
        this.allUserStories = userStories;
        this.separateSprintsFromBacklog();
      },
      error: (error) => {
        console.error('Erro ao carregar user stories:', error);
      },
    });
  }

  separateSprintsFromBacklog(): void {
    // Clear arrays
    this.sprintUserStories = [];
    this.backlogUserStories = [];

    if (!this.activeSprint) {
      // If no active sprint, all stories go to backlog
      this.backlogUserStories = [...this.allUserStories];
      return;
    }

    // Separate stories based on whether they're in the active sprint
    this.allUserStories.forEach((story) => {
      if (
        story.sprints &&
        story.sprints.some((s: any) => s.id === this.activeSprint?.id)
      ) {
        this.sprintUserStories.push(story);
      } else {
        this.backlogUserStories.push(story);
      }
    });
  }

  get todo(): UserStory[] {
    return this.backlogUserStories;
  }

  get done(): UserStory[] {
    return this.sprintUserStories;
  }

  get qtdTodo(): number {
    return this.backlogUserStories.length;
  }

  get qtdDone(): number {
    return this.sprintUserStories.length;
  }

  get timeTodo(): number {
    return this.backlogUserStories.reduce(
      (total, us) => total + (us.estimativa_tempo || 0),
      0,
    );
  }

  get timeDone(): number {
    return this.sprintUserStories.reduce(
      (total, us) => total + (us.estimativa_tempo || 0),
      0,
    );
  }

  drop(event: CdkDragDrop<UserStory[]>): void {
    const userStory = event.item.data;

    if (event.previousContainer === event.container) {
      // Same container, just reordering - no backend update needed
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      return;
    }

    // Different containers - moving between sprint and backlog
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    // Determine direction of movement based on container element ID
    const containerElement = event.container.element.nativeElement;
    const isMovingToSprint = containerElement.id === 'sprintList';
    const isMovingToBacklog = containerElement.id === 'backlogList';

    console.log('Drop event:', {
      userStory,
      userStoryId: userStory?.id,
      containerElementId: containerElement.id,
      isMovingToSprint,
      isMovingToBacklog,
      activeSprint: this.activeSprint,
      activeSprindId: this.activeSprint?.id,
    });

    if (!userStory?.id) {
      console.error('No user story ID found');
      return;
    }

    if (!this.activeSprint?.id) {
      console.error('No active sprint ID found');
      return;
    }

    if (isMovingToSprint) {
      // Moving from backlog to sprint
      console.log(
        'Assigning story',
        userStory.id,
        'to sprint',
        this.activeSprint.id,
      );
      this.userStoryService
        .assignToSprint(userStory.id, this.activeSprint.id)
        .subscribe({
          next: () => {
            // Successfully updated in backend
            console.log('Story successfully assigned to sprint');
          },
          error: (error) => {
            console.error('Erro ao adicionar story ao sprint:', error);
            // Revert the UI change on error
            this.separateSprintsFromBacklog();
          },
        });
    } else if (isMovingToBacklog) {
      // Moving from sprint to backlog
      console.log(
        'Removing story',
        userStory.id,
        'from sprint',
        this.activeSprint.id,
      );
      this.userStoryService
        .removeFromSprint(userStory.id, this.activeSprint.id)
        .subscribe({
          next: () => {
            // Successfully updated in backend
            console.log('Story successfully removed from sprint');
          },
          error: (error) => {
            console.error('Erro ao remover story do sprint:', error);
            // Revert the UI change on error
            this.separateSprintsFromBacklog();
          },
        });
    } else {
      console.error('Unknown container direction:', containerElement.id);
    }
  }

  navigateToKanban(): void {
    this.router.navigate(['/dashboard/projeto/', this.projectId, 'kanban']);
  }

  openConfigModal(): void {
    this.openConfigure = true;
  }

  closeConfigModal(): void {
    this.openConfigure = false;
  }

  onCreateOrUpdateSprint(sprint: Sprint): void {
    if (sprint.id) {
      // Update existing sprint
      this.sprintService.update(sprint.id, sprint).subscribe({
        next: () => {
          this.loadData();
          this.openConfigure = false;
        },
        error: (error) => {
          console.error('Erro ao atualizar sprint:', error);
        },
      });
    } else {
      // Create new sprint
      this.sprintService.create(sprint).subscribe({
        next: () => {
          this.loadData();
          this.openConfigure = false;
        },
        error: (error) => {
          console.error('Erro ao criar sprint:', error);
        },
      });
    }
  }

  onDeleteSprint(sprintId: number): void {
    this.sprintService.delete(sprintId).subscribe({
      next: () => {
        this.sprints = this.sprints.filter((s) => s.id !== sprintId);
        if (this.activeSprint?.id === sprintId) {
          this.activeSprint = this.sprints.length > 0 ? this.sprints[0] : null;
          this.separateSprintsFromBacklog();
        }
      },
      error: (error) => {
        console.error('Erro ao deletar sprint:', error);
      },
    });
  }

  onSelectSprint(sprint: Sprint): void {
    this.activeSprint = sprint;
    this.separateSprintsFromBacklog();
    this.openConfigure = false;
  }

  runSprint(): void {
    if (this.activeSprint && this.activeSprint.id) {
      // Logic to start/run a sprint
      console.log('Running sprint:', this.activeSprint);
    }
  }
}
