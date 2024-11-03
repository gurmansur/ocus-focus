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

  getAllFromProject(idProjeto: string): Observable<UserStory[]> {
    return this.httpClient.get<UserStory[]>(
      `${this.servicesRootUrl}/user-story/all`,
      {
        headers: {
          projeto: idProjeto,
        },
      }
    );
  }

  getBoardFromProject(idProjeto: string): Observable<Board> {
    return this.httpClient.get<Board>(
      `${this.servicesRootUrl}/kanban/swimlanes?projeto=${idProjeto}`
    );
  }
}
