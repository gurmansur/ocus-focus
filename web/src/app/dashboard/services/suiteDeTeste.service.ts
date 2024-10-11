import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuiteDeTeste } from '../models/suiteDeTeste';

@Injectable({
  providedIn: 'root',
})
export class SuiteDeTesteService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string
  ) {}

  create(suiteDeTeste: SuiteDeTeste, projeto: number): Observable<any> {
    return this.httpClient.post<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste`,
      suiteDeTeste
    );
  }

  update(suiteDeTeste: SuiteDeTeste, projeto: number): Observable<any> {
    return this.httpClient.patch<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/update/${suiteDeTeste.id}`,
      suiteDeTeste
    );
  }

  delete(idSuiteDeTeste: number): Observable<any> {
    return this.httpClient.delete<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/delete/${idSuiteDeTeste}`
    );
  }

  getById(idSuiteDeTeste: number): Observable<SuiteDeTeste> {
    return this.httpClient.get<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/findById/${idSuiteDeTeste}`
    );
  }

  getAll(): Observable<SuiteDeTeste[]> {
    return this.httpClient.get<SuiteDeTeste[]>(
      `${this.servicesRootUrl}/suite-de-teste`
    );
  }

  getFileTree(): Observable<SuiteDeTeste[]> {
    return this.httpClient.get<SuiteDeTeste[]>(
      `${this.servicesRootUrl}/suite-de-teste/file-tree`
    );
  }
}
