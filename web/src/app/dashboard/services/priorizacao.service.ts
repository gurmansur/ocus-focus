import { Inject, Injectable } from '@angular/core';
import { PriorizacaoRequest } from '../models/priorizacaoRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class PriorizacaoService {

  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
    private storageService: StorageService
  ) {}

  /**
   * Obtém os cabeçalhos de autorização para as requisições
   */
  private getHeaders() {
    return {
      Authorization: `Bearer ${this.storageService.getToken()}`,
    };
  }

  insertPriorizacao(priorizacao: PriorizacaoRequest, stakeholder: number): Observable<any> {
    return this.httpClient.post<PriorizacaoRequest>(
      `${this.servicesRootUrl}/priorizacao-stakeholders/new?stakeholder=${stakeholder}`,
      priorizacao,
      {
        headers: this.getHeaders(),
      }
    );
  }

  completePriorizacao(stakeholder: number): Observable<any> {
    return this.httpClient.patch<PriorizacaoRequest>(
      `${this.servicesRootUrl}/priorizacao-stakeholders/complete?stakeholder=${stakeholder}`,
      null,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getRequirementFinalClassification(id: number): Observable<any> {
    return this.httpClient.get<any>(
      `${this.servicesRootUrl}/priorizacao-stakeholders/getRequirementFinalClassification?requisito=${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  insertResultadoClassificacao(id: number, resultado: string): Observable<any> {
    return this.httpClient.post<any>(
      `${this.servicesRootUrl}/priorizacao-stakeholders/result?requisito=${id}&resultadoFinal=${resultado}`,
      null,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
