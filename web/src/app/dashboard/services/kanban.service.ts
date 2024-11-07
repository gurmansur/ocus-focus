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

  updateUserStory(id: number, userStory: EditUserstory) {
    return this.httpClient.patch<EditUserstory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      userStory
    );
  }

  deletarUserStory(id: number) {
    return this.httpClient.delete<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      {
        headers: {
          Authorization: 'Bearer: ' + localStorage.getItem('token'),
        },
      }
    );
  }

  getKanbanId(projeto: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.servicesRootUrl}/kanban/id?projeto=${projeto}`
    );
  }

  findUserStory(id: number): Observable<UserStory> {
    return this.httpClient.get<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      {
        headers: {
          Authorization: 'Bearer: ' + localStorage.getItem('token'),
        },
      }
    );
  }
}

interface ISelectSwimlane {
  id: number;
  nome: string;
}

interface EditUserstory {
  titulo: string;
  descricao: string;
  responsavel: string;
  estimativa_tempo: string;
  swimlane: string;
  projeto: number;
  criador: number;
  kanban: number;
}
