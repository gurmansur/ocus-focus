import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../models/board';
import { UserStory } from '../models/userStory';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string
  ) {}

  getBoardFromProject(idProjeto: string): Observable<Board> {
    return this.httpClient.get<Board>(
      `${this.servicesRootUrl}/kanban?projeto=${idProjeto}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
  }

  getSwimlaneFromProject(projeto: number): Observable<ISelectSwimlane[]> {
    return this.httpClient.get<ISelectSwimlane[]>(
      `${this.servicesRootUrl}/kanban/swimlanes?projeto=${projeto}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
  }

  createUserStory(userStory: UserStory) {
    return this.httpClient.post<UserStory>(
      `${this.servicesRootUrl}/user-story/new`,
      userStory
    );
  }

  getKanbanId(projeto: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.servicesRootUrl}/kanban/id?projeto=${projeto}`
    );
  }
}

interface ISelectSwimlane {
  id: number;
  nome: string;
}
