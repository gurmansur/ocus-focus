import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Comentario } from '../models/comentario';

@Injectable({
  providedIn: 'root',
})
export class ComentarioService {
  constructor(
    private httpClient: HttpClient,
    @Inject('servicesRootUrl') private servicesRootUrl: string
  ) {}

  postComentario(comentario: IPostComentario) {
    return this.httpClient.post<number>(
      `${this.servicesRootUrl}/comentario`,
      comentario,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
  }

  getComentariosUserStory(id: number) {
    return this.httpClient.get<Comentario[]>(
      `${this.servicesRootUrl}/comentario/us/${id}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
  }
}

interface IPostComentario {
  comentario: string;
  usuario_id: number;
  user_story_id: number;
}
