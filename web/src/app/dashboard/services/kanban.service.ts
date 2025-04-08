import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../shared/services/storage.service';
import { Board } from '../models/board';
import { Swimlane } from '../models/swimlane';
import { UserStory } from '../models/userStory';

/**
 * Interfaces para as operações do Kanban
 */
interface ISelectSwimlane {
  id: number;
  nome: string;
}

interface IEditSwimlane {
  nome: string;
  cor: string;
  kanban: number;
}

interface IEditUserStory {
  titulo: string;
  descricao: string;
  responsavel: string;
  estimativa_tempo: string;
  swimlane: string;
  projeto: number;
  criador: number;
  kanban: number;
}

interface IUpdateUserStorySwimlane {
  id: number | undefined;
  userStories: number[];
}

/**
 * Serviço responsável por gerenciar as operações relacionadas ao Kanban
 * e seus elementos (swimlanes, user stories)
 */
@Injectable({
  providedIn: 'root',
})
export class KanbanService {
  /**
   * Cabeçalhos HTTP com autenticação para reutilização nas requisições
   */
  private get authHeaders(): HttpHeaders {
    const token = this.storageService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
    private storageService: StorageService
  ) {}

  /**
   * Obtém o quadro Kanban de um projeto específico
   * @param idProjeto ID do projeto
   * @returns Observable com os dados do quadro
   */
  getBoardFromProject(idProjeto: string): Observable<Board> {
    return this.httpClient.get<Board>(
      `${this.servicesRootUrl}/kanban?projeto=${idProjeto}`,
      { headers: this.authHeaders }
    );
  }

  /**
   * Obtém as swimlanes de um projeto específico
   * @param projeto ID do projeto
   * @returns Observable com a lista de swimlanes
   */
  getSwimlaneFromProject(projeto: number): Observable<ISelectSwimlane[]> {
    return this.httpClient.get<ISelectSwimlane[]>(
      `${this.servicesRootUrl}/kanban/swimlanes?projeto=${projeto}`,
      { headers: this.authHeaders }
    );
  }

  /**
   * Cria uma nova user story
   * @param userStory Dados da user story a ser criada
   * @returns Observable com a user story criada
   */
  createUserStory(userStory: UserStory): Observable<UserStory> {
    return this.httpClient.post<UserStory>(
      `${this.servicesRootUrl}/user-story/new`,
      userStory,
      { headers: this.authHeaders }
    );
  }

  /**
   * Atualiza uma user story existente
   * @param id ID da user story
   * @param userStory Dados da user story a ser atualizada
   * @returns Observable com a user story atualizada
   */
  updateUserStory(id: number, userStory: IEditUserStory): Observable<IEditUserStory> {
    return this.httpClient.patch<IEditUserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      userStory,
      { headers: this.authHeaders }
    );
  }

  /**
   * Remove uma user story
   * @param id ID da user story a ser removida
   * @returns Observable com o resultado da operação
   */
  deletarUserStory(id: number): Observable<UserStory> {
    return this.httpClient.delete<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      { headers: this.authHeaders }
    );
  }

  /**
   * Cria uma nova swimlane
   * @param swimlane Dados da swimlane a ser criada
   * @returns Observable com a swimlane criada
   */
  createSwimlane(swimlane: Swimlane): Observable<Swimlane> {
    return this.httpClient.post<Swimlane>(
      `${this.servicesRootUrl}/kanban/swimlane`,
      swimlane,
      { headers: this.authHeaders }
    );
  }

  /**
   * Encontra uma swimlane pelo ID
   * @param id ID da swimlane
   * @returns Observable com os dados da swimlane
   */
  findSwimlane(id: number): Observable<IEditSwimlane> {
    return this.httpClient.get<IEditSwimlane>(
      `${this.servicesRootUrl}/kanban/swimlane?id=${id}`,
      { headers: this.authHeaders }
    );
  }

  /**
   * Atualiza uma swimlane existente
   * @param id ID da swimlane
   * @param swimlane Dados da swimlane a ser atualizada
   * @returns Observable com a swimlane atualizada
   */
  updateSwimlane(id: number, swimlane: IEditSwimlane): Observable<IEditUserStory> {
    return this.httpClient.patch<IEditUserStory>(
      `${this.servicesRootUrl}/kanban/swimlane/${id}`,
      swimlane,
      { headers: this.authHeaders }
    );
  }

  /**
   * Atualiza as user stories em uma swimlane
   * @param swimlane Dados da atualização das user stories
   * @returns Observable com o resultado da operação
   */
  updateUserStoriesInSwimlane(
    swimlane: IUpdateUserStorySwimlane
  ): Observable<unknown> {
    return this.httpClient.patch<IUpdateUserStorySwimlane>(
      `${this.servicesRootUrl}/kanban/user-story/update`,
      swimlane,
      { headers: this.authHeaders }
    );
  }

  /**
   * Remove uma swimlane
   * @param id ID da swimlane a ser removida
   * @returns Observable com o resultado da operação
   */
  deleteSwimlane(id: number): Observable<Swimlane> {
    return this.httpClient.delete<Swimlane>(
      `${this.servicesRootUrl}/kanban/swimlane/${id}`,
      { headers: this.authHeaders }
    );
  }

  /**
   * Obtém o ID do quadro Kanban de um projeto
   * @param projeto ID do projeto
   * @returns Observable com o ID do quadro Kanban
   */
  getKanbanId(projeto: number): Observable<number> {
    return this.httpClient.get<number>(
      `${this.servicesRootUrl}/kanban/id?projeto=${projeto}`,
      { headers: this.authHeaders }
    );
  }

  /**
   * Encontra uma user story pelo ID
   * @param id ID da user story
   * @returns Observable com os dados da user story
   */
  findUserStory(id: number): Observable<UserStory> {
    return this.httpClient.get<UserStory>(
      `${this.servicesRootUrl}/user-story/${id}`,
      { headers: this.authHeaders }
    );
  }
}
