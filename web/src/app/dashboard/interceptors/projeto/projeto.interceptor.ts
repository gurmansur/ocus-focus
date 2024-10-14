import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ProjetoInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const projetoId = localStorage.getItem('projeto_id');

    if (!projetoId) {
      this.router.navigate(['/dashboard']);
      return next.handle(req);
    }
    req = req.clone({
      setHeaders: { projeto: req.headers.get('projeto') || projetoId },
    });

    return next.handle(req);
  }
}
