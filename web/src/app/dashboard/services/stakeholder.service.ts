import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { Stakeholder } from '../models/stakeholder';
import { StakeholderSignup } from '../models/stakeholderSignup';

@Injectable({
  providedIn: 'root',
})
export class StakeholderService {
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

  listByProjeto(
    id: number,
    page: number,
    pageSize: number
  ): Observable<GetResponseStakeholders[]> {
    return this.httpClient.get<GetResponseStakeholders[]>(
      `${this.servicesRootUrl}/stakeholders/findByProjeto?projeto=${id}&page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  listByName(
    id: number,
    nome: string,
    page: number,
    pageSize: number
  ): Observable<GetResponseStakeholders[]> {
    return this.httpClient.get<GetResponseStakeholders[]>(
      `${this.servicesRootUrl}/stakeholders/findByNome?projeto=${id}&page=${page}&pageSize=${pageSize}&nome=${nome}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  create(stakeholder: StakeholderSignup): Observable<any> {
    return this.httpClient.post<StakeholderSignup>(
      `${this.servicesRootUrl}/create-stakeholder`,
      stakeholder,
      {
        headers: this.getHeaders(),
      }
    );
  }

  delete(idStakeholder: number): Observable<any> {
    return this.httpClient.delete<Stakeholder>(
      `${this.servicesRootUrl}/stakeholders/delete?stakeholder=${idStakeholder}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  alert(idStakeholder: number): Observable<any> {
    return this.httpClient.patch<Stakeholder>(
      `${this.servicesRootUrl}/stakeholders/alert?id=${idStakeholder}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  verifyParticipation(idProjeto: number): Observable<any> {
    return this.httpClient.get<Stakeholder>(
      `${this.servicesRootUrl}/stakeholders/verifyParticipation?projetoId=${idProjeto}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}

interface GetResponseStakeholders {
  items: Stakeholder[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
