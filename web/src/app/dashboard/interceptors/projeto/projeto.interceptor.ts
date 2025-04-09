import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../../shared/services/storage.service';

@Injectable()
export class ProjetoInterceptor implements HttpInterceptor {
  constructor(private router: Router, private storageService: StorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const projetoId = this.storageService.getItem('projeto_id');

    if (!projetoId) {
      return next.handle(req);
    }

    req = req.clone({
      setHeaders: { projeto: req.headers.get('projeto') || projetoId || '' },
    });

    return next.handle(req);
  }
}
