import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { ProjectContextService } from '../services/project-context.service';
import { TokenService } from '../services/token.service';

/**
 * HTTP Token interceptor
 * Automatically adds authentication token to all requests
 * Also adds projeto header/param when needed
 * Follows DRY principle - prevents repetition in services
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private tokenService: TokenService,
    private configService: ConfigService,
    private projectContextService: ProjectContextService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    // Only process API requests
    if (!this.isApiRequest(req)) {
      return next.handle(req);
    }

    // Get the token and projeto
    const token = this.tokenService.getToken();
    const projectId = this.projectContextService.getProjectId();

    // Build headers object
    const headersToSet: { [key: string]: string } = {};

    // Add authorization header if token exists
    if (token) {
      headersToSet['Authorization'] = `Bearer ${token}`;
    }

    // Add projeto header if project exists
    if (projectId) {
      headersToSet['projeto'] = projectId.toString();
    }

    // Clone request with headers
    let clonedReq = req;
    if (Object.keys(headersToSet).length > 0) {
      clonedReq = req.clone({
        setHeaders: headersToSet,
      });
    }

    // Also add projeto as query parameter if it exists and not already in URL
    if (projectId && !clonedReq.url.includes('projeto=')) {
      const params = new HttpParams({
        fromString: clonedReq.params.toString(),
      }).set('projeto', projectId.toString());
      clonedReq = clonedReq.clone({ params });
    }

    return next.handle(clonedReq);
  }

  /**
   * Check if the request is to the API (not external resources)
   * @param req HTTP request
   * @returns True if request is to the API
   */
  private isApiRequest(req: HttpRequest<any>): boolean {
    const apiUrl = this.configService.getApiBaseUrl();
    return req.url.startsWith(apiUrl) || !req.url.startsWith('http');
  }
}
