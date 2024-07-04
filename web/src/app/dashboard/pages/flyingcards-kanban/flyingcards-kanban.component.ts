import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { PlusIconComponent } from 'src/app/shared/icons/plus-icon/plus-icon.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ProjectHeaderComponent } from 'src/app/shared/project-header/project-header.component';
import { Board } from '../../models/board';
import { Column } from '../../models/column';
import { Projeto } from '../../models/projeto';
import { ProjetoService } from '../../services/projeto.service';

@Component({
  selector: 'app-flyingcards-kanban',
  standalone: true,
  imports: [
    NgFor,
    ProjectHeaderComponent,
    CdkDrag,
    CdkDropList,
    PlusIconComponent,
    ButtonComponent,
    ModalComponent,
  ],
  templateUrl: './flyingcards-kanban.component.html',
  styleUrl: './flyingcards-kanban.component.css',
})
export class FlyingcardsKanbanComponent implements OnInit {
  private projectId!: number;
  project!: Projeto;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private projectService: ProjetoService
  ) {
    this.projectId = this.route.snapshot.params['id'];
  }

  board: Board = new Board('Test Board', [
    new Column('Backlog', ['fazer alguma coisa']),
    new Column('Work in Progress (WIP)', ['fazendo alguma coisa']),
    new Column('Revision', ['revisando alguma coisa']),
    new Column('Done', ['alguma coisa que está pronta']),
  ]);

  buscarProjeto(id: number, user: number) {
    this.projectService.findById(id, user).subscribe((project) => {
      this.project = project;
    });
  }

  navigateToFlyingCards() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'painel-flyingcards',
    ]);
  }

  navigateToCreateUserStory() {
    this.router.navigate([
      '/dashboard/projeto/',
      this.projectId,
      'kanban',
      'criar-us',
    ]);
  }

  ngOnInit() {}

  // TODO depois preciso adicionar o cdk do angular pra funcionar o kanban aqui

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
  }
}
