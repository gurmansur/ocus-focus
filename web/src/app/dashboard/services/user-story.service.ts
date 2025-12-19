import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStory } from '../models/userStory';

@Injectable({
  providedIn: 'root',
})
export class UserStoryService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
  ) {}

  findAll(): Observable<UserStory[]> {
    return this.httpClient.get<UserStory[]>(
      `${this.servicesRootUrl}/user-story`,
    );
  }

  findByProject(projectId: number): Observable<UserStory[]> {
    return this.httpClient.get<UserStory[]>(
      `${this.servicesRootUrl}/user-story/projeto/${projectId}`,
    );
  }

  findOne(id: number): Observable<UserStory> {
    return this.httpClient.get<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
    );
  }

  create(userStory: UserStory): Observable<UserStory> {
    return this.httpClient.post<UserStory>(
      `${this.servicesRootUrl}/user-story`,
      userStory,
    );
  }

  update(id: number, userStory: UserStory): Observable<UserStory> {
    return this.httpClient.patch<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      userStory,
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.servicesRootUrl}/user-story/${id}`,
    );
  }

  assignToSprint(userStoryId: number, sprintId: number): Observable<UserStory> {
    return this.httpClient.patch<UserStory>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/assign-sprint`,
      { sprintId },
    );
  }

  removeFromSprint(
    userStoryId: number,
    sprintId: number,
  ): Observable<UserStory> {
    return this.httpClient.patch<UserStory>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/remove-sprint`,
      { sprintId },
    );
  }

  linkCasoUso(userStoryId: number, casoUsoId: number): Observable<UserStory> {
    return this.httpClient.patch<UserStory>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/link-caso-uso`,
      { casoUsoId },
    );
  }

  unlinkCasoUso(userStoryId: number, casoUsoId: number): Observable<UserStory> {
    return this.httpClient.patch<UserStory>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/unlink-caso-uso`,
      { casoUsoId },
    );
  }

  getCasosUso(userStoryId: number): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/casos-uso`,
    );
  }

  getMentionables(
    projectId: number,
  ): Observable<
    {
      usuarioId: number;
      nome: string;
      tipo: 'colaborador' | 'stakeholder';
      id: number;
    }[]
  > {
    return this.httpClient.get<
      {
        usuarioId: number;
        nome: string;
        tipo: 'colaborador' | 'stakeholder';
        id: number;
      }[]
    >(`${this.servicesRootUrl}/user-story/mentionables?projeto=${projectId}`);
  }
}
