import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ConfiguracaoSeleniumDto {
  id?: number;
  nome: string;
  navegador: 'CHROME' | 'FIREFOX' | 'EDGE' | 'SAFARI';
  headless: boolean;
  timeoutPadrao: number;
  timeoutImplicito: number;
  timeoutCarregamentoPagina: number;
  resolucao: string;
  maximizarJanela: boolean;
  aceitarCertificadosSSL: boolean;
  capturarScreenshots: boolean;
  capturarLogs: boolean;
  urlSeleniumGrid?: string;
  opcoesAdicionais?: Record<string, any>;
  userAgent?: string;
  proxy?: string;
  ativa: boolean;
}

export interface CreateConfiguracaoSeleniumDto extends Omit<
  ConfiguracaoSeleniumDto,
  'id'
> {}

export interface UpdateConfiguracaoSeleniumDto extends Partial<CreateConfiguracaoSeleniumDto> {}

@Injectable({ providedIn: 'root' })
export class ConfiguracaoSeleniumService {
  private baseUrl = `${environment.apiBaseUrl}/configuracao-selenium`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ConfiguracaoSeleniumDto[]> {
    return this.http.get<ConfiguracaoSeleniumDto[]>(this.baseUrl);
  }

  getAtiva(): Observable<ConfiguracaoSeleniumDto> {
    return this.http.get<ConfiguracaoSeleniumDto>(`${this.baseUrl}/ativa`);
  }

  getById(id: number): Observable<ConfiguracaoSeleniumDto> {
    return this.http.get<ConfiguracaoSeleniumDto>(`${this.baseUrl}/${id}`);
  }

  create(
    data: CreateConfiguracaoSeleniumDto,
  ): Observable<ConfiguracaoSeleniumDto> {
    return this.http.post<ConfiguracaoSeleniumDto>(this.baseUrl, data);
  }

  update(
    id: number,
    data: UpdateConfiguracaoSeleniumDto,
  ): Observable<ConfiguracaoSeleniumDto> {
    return this.http.patch<ConfiguracaoSeleniumDto>(
      `${this.baseUrl}/${id}`,
      data,
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
