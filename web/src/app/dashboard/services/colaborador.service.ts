import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { Colaborador, IColaborador } from '../models/colaborador';

/**
 * Serviço responsável por gerenciar operações relacionadas aos colaboradores
 * no contexto do dashboard.
 */
@Injectable({
  providedIn: 'root',
})
export class ColaboradorService {
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

  /**
   * Busca colaboradores pelo nome em um projeto específico
   * @param nome Nome ou parte do nome do colaborador
   * @param projeto ID do projeto
   * @returns Observable com a lista de colaboradores encontrados
   */
  findByNome(nome: string, projeto: number): Observable<IColaborador[]> {
    return this.httpClient.get<IColaborador[]>(
      `${this.servicesRootUrl}/colaboradores?name=${nome}&projeto=${projeto}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Busca todos os colaboradores de um projeto específico
   * @param projeto ID do projeto
   * @returns Observable com a lista de todos os colaboradores do projeto
   */
  findAllFromProject(projeto: number): Observable<IColaborador[]> {
    return this.httpClient.get<IColaborador[]>(
      `${this.servicesRootUrl}/colaboradores/projeto?projeto=${projeto}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}
