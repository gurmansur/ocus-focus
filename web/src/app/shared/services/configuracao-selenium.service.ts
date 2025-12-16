import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConfiguracaoSeleniumDto {
  id: number;
  nome: string;
  navegador: 'Chrome' | 'Firefox' | 'Edge' | 'Safari';
  headless: boolean;
  timeoutImplicito?: number;
  timeoutPagina?: number;
  timeoutScript?: number;
  options?: Record<string, any>;
  gridUrl?: string;
  projetoId: number;
}

export interface CreateConfiguracaoSeleniumDto
  extends Omit<ConfiguracaoSeleniumDto, 'id' | 'projetoId'> {
  projetoId: number;
}

export interface UpdateConfiguracaoSeleniumDto
  extends Partial<CreateConfiguracaoSeleniumDto> {}

@Injectable({ providedIn: 'root' })
export class ConfiguracaoSeleniumService {
  private baseUrl = `${environment.apiBaseUrl}/configuracao-selenium`;

  constructor(private http: HttpClient) {}

  listByProjeto(projetoId: number): Observable<ConfiguracaoSeleniumDto[]> {
    return this.http.get<ConfiguracaoSeleniumDto[]>(
      `${this.baseUrl}/projeto/${projetoId}`
    );
  }

  create(
    data: CreateConfiguracaoSeleniumDto
  ): Observable<ConfiguracaoSeleniumDto> {
    return this.http.post<ConfiguracaoSeleniumDto>(this.baseUrl, data);
  }

  update(
    id: number,
    data: UpdateConfiguracaoSeleniumDto
  ): Observable<ConfiguracaoSeleniumDto> {
    return this.http.patch<ConfiguracaoSeleniumDto>(
      `${this.baseUrl}/${id}`,
      data
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
