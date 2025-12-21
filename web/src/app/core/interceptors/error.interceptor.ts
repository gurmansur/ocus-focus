import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * HTTP Error handling interceptor
 * Centralizes error handling logic for all HTTP requests
 * Follows Single Responsibility Principle
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Handle HTTP errors
   * @param error HTTP error response
   */
  private handleError(error: HttpErrorResponse): void {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    console.error(errorMessage);

    // Handle specific status codes
    switch (error.status) {
      case 401:
        // Unauthorized - could trigger logout
        this.handleUnauthorized();
        break;
      case 403:
        // Forbidden
        console.error('Access forbidden');
        break;
      case 404:
        // Not found
        console.error('Resource not found');
        break;
      case 500:
        // Server error
        console.error('Server error');
        break;
    }
  }

  /**
   * Handle unauthorized access (401)
   */
  private handleUnauthorized(): void {
    // Could clear storage and redirect to login here
    // For now, just log
    console.error('User is not authorized. Please login again.');
  }
}
