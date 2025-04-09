import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { Colaborador } from '../models/colaborador';
import { Projeto } from '../models/projeto';

@Injectable({
  providedIn: 'root',
})
export class ProjetoService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
    private storageService: StorageService
  ) {}

  private getHeaders() {
    return {
      Authorization: 'Bearer ' + this.storageService.getToken(),
    };
  }

  create(projeto: Projeto): Observable<any> {
    const userId = this.storageService.getItem('usu_id');
    return this.httpClient.post<Projeto>(
      `${this.servicesRootUrl}/projetos/new?user=${userId}`,
      projeto,
      {
        headers: this.getHeaders(),
      }
    );
  }

  update(projeto: Projeto): Observable<any> {
    return this.httpClient.patch<Projeto>(
      `${this.servicesRootUrl}/projetos/update?projeto=${projeto.id}`,
      projeto,
      {
        headers: this.getHeaders(),
      }
    );
  }

  delete(idProjeto: number): Observable<any> {
    return this.httpClient.delete<Projeto>(
      `${this.servicesRootUrl}/projetos/delete?projeto=${idProjeto}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  findById(idProjeto: number, idColaborador: number): Observable<any> {
    return this.httpClient.get<Projeto>(
      `${this.servicesRootUrl}/projetos/findById?projeto=${idProjeto}&colaborador=${idColaborador}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  findByIdStakeholder(idStakeholder: number): Observable<any> {
    return this.httpClient.get<Projeto>(
      `${this.servicesRootUrl}/projetos/findByIdStakeholder?stakeholder=${idStakeholder}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  findByColaborador(): Observable<GetResponseProjetos[]> {
    const userId = this.storageService.getItem('usu_id');
    return this.httpClient.get<GetResponseProjetos[]>(
      `${this.servicesRootUrl}/projetos/findByColaborador?user=${userId}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  findByNome(
    id: number,
    nome: string,
    page: number,
    pageSize: number
  ): Observable<GetResponseProjetos[]> {
    return this.httpClient.get<GetResponseProjetos[]>(
      `${this.servicesRootUrl}/projetos/findByNome?user=${id}&nome=${nome}&page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getColaboradoresByProjeto(
    id: number,
    page?: number,
    pageSize?: number
  ): Observable<GetResponseColaboradores> {
    return this.httpClient.get<GetResponseColaboradores>(
      `${this.servicesRootUrl}/projetos/colaboradores?projeto=${id}&page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getColaboradoresByProjetoAndNome(
    id: number,
    nome: string,
    page: number,
    pageSize: number
  ): Observable<GetResponseColaboradores[]> {
    return this.httpClient.get<GetResponseColaboradores[]>(
      `${this.servicesRootUrl}/projetos/colaboradores/findByNome?projeto=${id}&nome=${nome}&page=${page}&pageSize=${pageSize}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  addColaborador(idProjeto: number, idColaborador: number): Observable<any> {
    return this.httpClient.post<any>(
      `${this.servicesRootUrl}/projetos/colaborador/add?projeto=${idProjeto}&colaborador=${idColaborador}`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  removeColaborador(idProjeto: number, idColaborador: number): Observable<any> {
    return this.httpClient.delete<any>(
      `${this.servicesRootUrl}/projetos/colaborador/remove?projeto=${idProjeto}&colaborador=${idColaborador}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getNumberOfProjetos(id: number): Observable<EntityCount> {
    return this.httpClient.get<EntityCount>(
      `${this.servicesRootUrl}/projetos/metrics/total?user=${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getNumberOfNovosProjetos(id: number): Observable<EntityCount> {
    return this.httpClient.get<EntityCount>(
      `${this.servicesRootUrl}/projetos/metrics/new?user=${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getNumberOfProjetosEmAndamento(id: number): Observable<EntityCount> {
    return this.httpClient.get<EntityCount>(
      `${this.servicesRootUrl}/projetos/metrics/ongoing?user=${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getNumberOfProjetosConcluidos(id: number): Observable<EntityCount> {
    return this.httpClient.get<EntityCount>(
      `${this.servicesRootUrl}/projetos/metrics/finished?user=${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getProjetosRecentes(id: number): Observable<Projeto[]> {
    return this.httpClient.get<Projeto[]>(
      `${this.servicesRootUrl}/projetos/recentes?user=${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}

interface GetResponseProjetos {
  items: Projeto[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}

interface EntityCount {
  totalCount: number;
}

interface GetResponseColaboradores {
  items: Colaborador[];
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
