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
      const token = localStorage.getItem('token');
      const projetoId = localStorage.getItem('projeto_id');
      const url = `${environment.apiBaseUrl}/execucao-de-teste/executar/${casoDeTesteId}/stream`;

      console.log('[SSE] Connecting to:', url);

      const eventSource = token
        ? new EventSourcePolyfill(url, {
            headers: {
              Authorization: `Bearer ${token}`,
              ...(projetoId ? { projeto: projetoId } : {}),
            },
            withCredentials: true,
          })
        : new EventSource(url);

      eventSource.onopen = () => {
        console.log('[SSE] Connection opened');
      };

      eventSource.onmessage = (event: MessageEvent) => {
        console.log('[SSE] Message received:', event.data);
        const data = JSON.parse(event.data);
        console.log('[SSE] Parsed data:', data);
        observer.next(data);
        if (data.type === 'complete' || data.type === 'error') {
          console.log('[SSE] Closing connection, type:', data.type);
          eventSource.close();
          observer.complete();
        }
      };

      eventSource.onerror = (error: Event) => {
        console.error('[SSE] Error:', error);
        eventSource.close();
        observer.error(error);
      };

      return () => {
        console.log('[SSE] Cleanup: closing connection');
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
        const data = JSON.parse(event.data);
        observer.next(data);
        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close();
          observer.complete();
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
        const data = JSON.parse(event.data);
        observer.next(data);
        if (data.type === 'complete' || data.type === 'error') {
          eventSource.close();
          observer.complete();
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
