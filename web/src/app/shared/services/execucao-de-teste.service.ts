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

  executar(
    casoDeTesteId: number,
    configuracaoId?: number
  ): Observable<ResultadoExecucao> {
    const body: any = { casoDeTesteId };
    if (configuracaoId) body.configuracaoSeleniumId = configuracaoId;
    return this.http.post<ResultadoExecucao>(
      `${this.baseUrl}/executar/${casoDeTesteId}`,
      body
    );
  }

  executarComStream(casoDeTesteId: number): Observable<any> {
    return new Observable((observer) => {
      // NOTE: Security consideration - tokens stored in localStorage are vulnerable to XSS attacks.
      // Consider migrating to httpOnly cookies or a more secure storage mechanism for production.
      const token = localStorage.getItem('token');
      const projetoId = localStorage.getItem('projeto_id');
      const url = `${environment.apiBaseUrl}/execucao-de-teste/executar/${casoDeTesteId}/stream`;

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
          observer.error(new Error('Failed to parse server response'));
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

  executarProjetoComStream(): Observable<any> {
    return new Observable((observer) => {
      const token = localStorage.getItem('token');
      const projetoId = localStorage.getItem('projeto_id');
      const url = `${environment.apiBaseUrl}/execucao-de-teste/executar-projeto/stream`;

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
          observer.error(new Error('Failed to parse server response'));
          eventSource.close();
        }
      };

      eventSource.onerror = (error: Event) => {
        eventSource.close();
        observer.error(error);
      };

      return () => eventSource.close();
    });
  }

  executarSuiteComStream(suiteId: number): Observable<any> {
    return new Observable((observer) => {
      const token = localStorage.getItem('token');
      const projetoId = localStorage.getItem('projeto_id');
      const url = `${environment.apiBaseUrl}/execucao-de-teste/executar-suite/${suiteId}/stream`;

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
          observer.error(new Error('Failed to parse server response'));
          eventSource.close();
        }
      };

      eventSource.onerror = (error: Event) => {
        eventSource.close();
        observer.error(error);
      };

      return () => eventSource.close();
    });
  }

  mudarStatus(
    id: number,
    status: 'SUCESSO' | 'FALHA' | 'PENDENTE',
    observacao?: string,
    resposta?: string
  ): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, {
      resultado: status,
      observacao,
      resposta,
    });
  }

  getGrafico(
    projetoId: number
  ): Observable<{ labels: string[]; data: number[] }> {
    return this.http.get<{ labels: string[]; data: number[] }>(
      `${this.baseUrl}/grafico/${projetoId}`
    );
  }
}
