import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notificacao {
  id: number;
  mensagem: string;
  lido: boolean;
  criado_em: string | Date;
  userStoryId?: number | null;
  projetoId?: number | null;
  comentarioId?: number | null;
}

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
  ) {}

  list(usuarioId: number): Observable<Notificacao[]> {
    return this.httpClient.get<Notificacao[]>(
      `${this.servicesRootUrl}/notificacoes?usuarioId=${usuarioId}`,
    );
  }

  markRead(id: number): Observable<{ success: boolean }> {
    return this.httpClient.patch<{ success: boolean }>(
      `${this.servicesRootUrl}/notificacoes/${id}/read`,
      {},
    );
  }
}
