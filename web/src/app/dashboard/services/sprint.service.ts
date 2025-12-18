import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from '../models/sprint';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
  ) {}

  create(sprint: Sprint): Observable<Sprint> {
    return this.httpClient.post<Sprint>(
      `${this.servicesRootUrl}/sprint`,
      sprint,
    );
  }

  findAll(): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(`${this.servicesRootUrl}/sprint`);
  }

  findByProject(projectId: number): Observable<Sprint[]> {
    return this.httpClient.get<Sprint[]>(
      `${this.servicesRootUrl}/sprint/projeto/${projectId}`,
    );
  }

  findOne(id: number): Observable<Sprint> {
    return this.httpClient.get<Sprint>(`${this.servicesRootUrl}/sprint/${id}`);
  }

  update(id: number, sprint: Sprint): Observable<Sprint> {
    return this.httpClient.patch<Sprint>(
      `${this.servicesRootUrl}/sprint/${id}`,
      sprint,
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.servicesRootUrl}/sprint/${id}`);
  }
}
