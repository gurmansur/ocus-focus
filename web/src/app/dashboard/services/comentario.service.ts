import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Comentario {
  id: number;
  comentario: string;
  criado_em: Date;
  modificado_em: Date;
  usuario: {
    id: number;
    nome: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string,
  ) {}

  getComentarios(userStoryId: number): Observable<Comentario[]> {
    return this.httpClient.get<Comentario[]>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/comentarios`,
    );
  }

  createComentario(
    userStoryId: number,
    comentario: string,
    usuarioId: number,
    mentionUsuarioIds?: number[],
  ): Observable<Comentario> {
    return this.httpClient.post<Comentario>(
      `${this.servicesRootUrl}/user-story/${userStoryId}/comentarios`,
      { comentario, usuarioId, mentionUsuarioIds },
    );
  }

  deleteComentario(comentarioId: number): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.servicesRootUrl}/user-story/comentarios/${comentarioId}`,
    );
  }
}
