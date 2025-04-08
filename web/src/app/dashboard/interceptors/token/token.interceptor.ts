import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';

/**
 * Interceptor responsável por adicionar automaticamente o token de autenticação
 * a todas as requisições HTTP realizadas pela aplicação.
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  /**
   * Construtor do interceptor
   * @param storageService Serviço para gerenciamento de armazenamento local
   */
  constructor(private storageService: StorageService) {}

  /**
   * Método que intercepta as requisições HTTP e adiciona o token de autenticação
   * ao header Authorization quando disponível.
   * 
   * @param req A requisição HTTP original
   * @param next O handler para processar a requisição
   * @returns Um Observable com o evento HTTP resultante
   */
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = this.storageService.getToken();

    if (token) {
      // Clona a requisição para adicionar o cabeçalho de autorização
      const clonedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      
      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
