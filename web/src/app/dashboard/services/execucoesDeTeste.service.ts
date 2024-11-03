import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExecucaoDeTeste } from '../models/execucaoDeTeste';
import { ExecutarTeste } from '../models/executarTeste';

@Injectable({
  providedIn: 'root',
})
export class ExecucaoDeTesteService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string
  ) {}

  create(execucaoDeTeste: ExecucaoDeTeste): Observable<any> {
    return this.httpClient.post<ExecucaoDeTeste>(
      `${this.servicesRootUrl}/execucao-de-teste`,
      execucaoDeTeste
    );
  }

  update(id: number, execucaoDeTeste: ExecucaoDeTeste): Observable<any> {
    return this.httpClient.patch<ExecucaoDeTeste>(
      `${this.servicesRootUrl}/execucao-de-teste/${id}`,
      execucaoDeTeste
    );
  }

  changeStatus(
    id: number,
    executarTeste: Partial<ExecutarTeste>
  ): Observable<any> {
    return this.httpClient.patch<ExecutarTeste>(
      `${this.servicesRootUrl}/execucao-de-teste/${id}/status`,
      executarTeste
    );
  }

  delete(idExecucaoDeTeste: number): Observable<any> {
    return this.httpClient.delete<ExecucaoDeTeste>(
      `${this.servicesRootUrl}/execucao-de-teste/${idExecucaoDeTeste}`
    );
  }

  getById(idExecucaoDeTeste: number): Observable<ExecucaoDeTeste> {
    return this.httpClient.get<ExecucaoDeTeste>(
      `${this.servicesRootUrl}/execucao-de-teste/${idExecucaoDeTeste}`
    );
  }

  getAll(): Observable<ExecucaoDeTeste[]> {
    return this.httpClient.get<ExecucaoDeTeste[]>(
      `${this.servicesRootUrl}/execucao-de-teste`
    );
  }
}
