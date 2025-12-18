import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Board } from '../models/board';
import { Swimlane } from '../models/swimlane';
import { UserStory } from '../models/userStory';

@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
  ) {}

  getBoardFromProject(idProjeto: string, sprintId?: number): Observable<Board> {
    let url = `${this.servicesRootUrl}/kanban?projeto=${idProjeto}`;
    if (sprintId) {
      url += `&sprint=${sprintId}`;
    }
    return this.httpClient.get<Board>(url, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
  }

  getSwimlaneFromProject(projeto: number): Observable<ISelectSwimlane[]> {
    return this.httpClient.get<ISelectSwimlane[]>(
      `${this.servicesRootUrl}/kanban/swimlanes?projeto=${projeto}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      },
    );
  }

  createUserStory(userStory: UserStory) {
    return this.httpClient.post<UserStory>(
      `${this.servicesRootUrl}/user-story/new`,
      userStory,
    );
  }

  updateUserStory(id: number, userStory: EditUserstory) {
    return this.httpClient.patch<EditUserstory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      userStory,
    );
  }

  deletarUserStory(id: number) {
    return this.httpClient.delete<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      {
        headers: {
          Authorization: 'Bearer: ' + localStorage.getItem('token'),
        },
      },
    );
  }

  createSwimlane(swimlane: Swimlane): Observable<Swimlane> {
    return this.httpClient.post<Swimlane>(
      `${this.servicesRootUrl}/kanban/swimlane`,
      swimlane,
    );
  }

  findSwimlane(id: number) {
    return this.httpClient.get<IEditSwimlane>(
      `${this.servicesRootUrl}/kanban/swimlane?id=${id}`,
    );
  }

  updateSwimlane(id: number, swimlane: IEditSwimlane) {
    return this.httpClient.patch<EditUserstory>(
      `${this.servicesRootUrl}/kanban/swimlane/${id}`,
      swimlane,
    );
  }

  updateUserStoriesInSwimlane(
    swimlane: IUpdateUserStorySwimlane,
  ): Observable<any> {
    return this.httpClient.patch<IUpdateUserStorySwimlane>(
      `${this.servicesRootUrl}/kanban/user-story/update`,
      swimlane,
      {
        headers: {
          Authorization: 'Bearer: ' + localStorage.getItem('token'),
        },
      },
    );
  }

  deleteSwimlane(id: number) {
    return this.httpClient.delete<Swimlane>(
      `${this.servicesRootUrl}/kanban/swimlane/${id}`,
      {
        headers: {
          Authorization: 'Bearer: ' + localStorage.getItem('token'),
        },
      },
    );
  }

  getKanbanId(projeto: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.servicesRootUrl}/kanban/id?projeto=${projeto}`,
    );
  }

  findUserStory(id: number): Observable<UserStory> {
    return this.httpClient.get<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      {
        headers: {
          Authorization: 'Bearer: ' + localStorage.getItem('token'),
        },
      },
    );
  }
}

interface ISelectSwimlane {
  id: number;
  nome: string;
}

interface IEditSwimlane {
  nome: string;
  cor: string;
  kanban: number;
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

interface IUpdateUserStorySwimlane {
  id: number | undefined;
  userStories: number[];
}
