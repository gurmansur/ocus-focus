import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileTree } from '../models/fileTree';
import { SuiteDeTeste } from '../models/suiteDeTeste';

@Injectable({
  providedIn: 'root',
})
export class SuiteDeTesteService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string
  ) {}

  create(suiteDeTeste: SuiteDeTeste): Observable<any> {
    return this.httpClient.post<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste`,
      suiteDeTeste
    );
  }

  update(id: number, suiteDeTeste: SuiteDeTeste): Observable<any> {
    return this.httpClient.patch<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/${id}`,
      suiteDeTeste
    );
  }

  delete(idSuiteDeTeste: number): Observable<any> {
    return this.httpClient.delete<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/${idSuiteDeTeste}`
    );
  }

  getById(idSuiteDeTeste: number): Observable<SuiteDeTeste> {
    return this.httpClient.get<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/${idSuiteDeTeste}`
    );
  }

  getAll(): Observable<SuiteDeTeste[]> {
    return this.httpClient.get<SuiteDeTeste[]>(
      `${this.servicesRootUrl}/suite-de-teste`
    );
  }

  getFileTree(): Observable<FileTree> {
    return this.httpClient.get<FileTree>(
      `${this.servicesRootUrl}/suite-de-teste/file-tree`
    );
  }

  changeSuite(idSuiteDeTeste: number, suiteId: number): Observable<any> {
    return this.httpClient.patch<SuiteDeTeste>(
      `${this.servicesRootUrl}/suite-de-teste/${idSuiteDeTeste}/change-suite`,
      { suiteId }
    );
  }
}
