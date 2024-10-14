import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CasoDeTeste } from '../models/casoDeTeste';

@Injectable({
  providedIn: 'root',
})
export class CasoDeTesteService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string
  ) {}

  create(casoDeTeste: CasoDeTeste): Observable<any> {
    return this.httpClient.post<CasoDeTeste>(
      `${this.servicesRootUrl}/caso-de-teste`,
      casoDeTeste
    );
  }

  update(id: number, casoDeTeste: CasoDeTeste): Observable<any> {
    return this.httpClient.patch<CasoDeTeste>(
      `${this.servicesRootUrl}/caso-de-teste/${id}`,
      casoDeTeste
    );
  }

  delete(idCasoDeTeste: number): Observable<any> {
    return this.httpClient.delete<CasoDeTeste>(
      `${this.servicesRootUrl}/caso-de-teste/delete/${idCasoDeTeste}`
    );
  }

  getById(idCasoDeTeste: number): Observable<CasoDeTeste> {
    return this.httpClient.get<CasoDeTeste>(
      `${this.servicesRootUrl}/caso-de-teste/${idCasoDeTeste}`
    );
  }

  getAll(): Observable<CasoDeTeste[]> {
    return this.httpClient.get<CasoDeTeste[]>(
      `${this.servicesRootUrl}/caso-de-teste`
    );
  }

  changeSuite(idCasoDeTeste: number, suiteId: number): Observable<any> {
    return this.httpClient.patch<CasoDeTeste>(
      `${this.servicesRootUrl}/caso-de-teste/${idCasoDeTeste}/change-suite`,
      { suiteId }
    );
  }
}
