import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Board } from '../../models/board';
import { Column } from '../../models/column';

@Component({
  selector: 'app-flyingcards-kanban',
  standalone: true,
  imports: [NgFor],
  templateUrl: './flyingcards-kanban.component.html',
  styleUrl: './flyingcards-kanban.component.css',
})
export class FlyingcardsKanbanComponent {
  constructor() {}

  board: Board = new Board('Test Board', [
    new Column('Backlog', ['fazer alguma coisa']),
    new Column('Work in Progress (WIP)', ['fazendo alguma coisa já']),
    new Column('Revision', ['revisando alguma coisa']),
    new Column('Done', ['alguma coisa que está pronta já']),
  ]);

  // TODO depois preciso adicionar o cdk do angular pra funcionar o kanban aqui

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
}
