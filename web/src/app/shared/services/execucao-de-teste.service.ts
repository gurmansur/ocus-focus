import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResultadoExecucao } from '../models/test-flow.models';

@Injectable({ providedIn: 'root' })
export class ExecucaoDeTesteService {
  private baseUrl = `${environment.apiBaseUrl}/execucao-de-teste`;

  constructor(private http: HttpClient) {}

  /**
   * Creates an SSE stream Observable with proper error handling and cleanup.
   * Centralizes the event source initialization and message handling logic.
   * @param url - The SSE endpoint URL
   * @returns Observable that emits parsed SSE events
   */
  private createSseStream(url: string): Observable<any> {
    return new Observable((observer) => {
      // NOTE: Security consideration - tokens stored in localStorage are vulnerable to XSS attacks.
      // Consider migrating to httpOnly cookies or a more secure storage mechanism for production.
      const token = localStorage.getItem('token');
      const projetoId = localStorage.getItem('projeto_id');

      const eventSource = token
        ? new EventSourcePolyfill(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              ...(projetoId ? { projeto: projetoId } : {}),
            },
            withCredentials: true,
          })
        : new EventSource(url);

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          observer.next(data);
          if (data.type === 'complete' || data.type === 'error') {
            eventSource.close();
            observer.complete();
          }
        } catch (error) {
          console.error('[SSE] Error parsing JSON:', error);
          const parseError = new Error('Failed to parse server response');
          observer.error(parseError);
          eventSource.close();
        }
      };

      eventSource.onerror = (error: Event) => {
        eventSource.close();
        observer.error(error);
      };

      return () => {
        eventSource.close();
      };
    });
  }

  executar(
    casoDeTesteId: number,
    configuracaoId?: number,
  ): Observable<ResultadoExecucao> {
    const body: any = { casoDeTesteId };
    if (configuracaoId) body.configuracaoSeleniumId = configuracaoId;
    return this.http.post<ResultadoExecucao>(
      `${this.baseUrl}/executar/${casoDeTesteId}`,
      body,
    );
  }

  executarComStream(casoDeTesteId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/execucao-de-teste/executar/${casoDeTesteId}/stream`;
    return this.createSseStream(url);
  }

  executarProjetoComStream(): Observable<any> {
    const url = `${environment.apiBaseUrl}/execucao-de-teste/executar-projeto/stream`;
    return this.createSseStream(url);
  }

  executarSuiteComStream(suiteId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/execucao-de-teste/executar-suite/${suiteId}/stream`;
    return this.createSseStream(url);
  }

  executarCasoUsoComStream(casoUsoId: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/execucao-de-teste/executar-caso-uso/${casoUsoId}/stream`;
    return this.createSseStream(url);
  }

  mudarStatus(
    id: number,
    status: 'SUCESSO' | 'FALHA' | 'PENDENTE',
    observacao?: string,
    resposta?: string,
  ): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, {
      resultado: status,
      observacao,
      resposta,
    });
  }

  getGrafico(
    projetoId: number,
  ): Observable<{ labels: string[]; data: number[] }> {
    return this.http.get<{ labels: string[]; data: number[] }>(
      `${this.baseUrl}/grafico/${projetoId}`,
    );
  }
}
