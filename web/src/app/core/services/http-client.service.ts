import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';
import { TokenService } from './token.service';

/**
 * Base HTTP client service
 * Provides centralized HTTP operations with automatic token injection
 * Follows DRY principle - prevents repetition of auth headers across services
 * Follows Dependency Inversion - depends on abstractions (ConfigService, TokenService)
 */
@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService,
    private tokenService: TokenService,
  ) {}

  /**
   * Build authorization headers with current token
   * @returns HttpHeaders with Authorization header
   */
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const token = this.tokenService.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Get the full API URL for a given endpoint
   * @param endpoint API endpoint path
   * @returns Full URL
   */
  private getFullUrl(endpoint: string): string {
    const baseUrl = this.configService.getApiBaseUrl();
    return endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  }

  /**
   * Perform GET request
   * @param endpoint API endpoint
   * @param options Optional HTTP options (params, headers, etc.)
   * @returns Observable of response
   */
  get<T>(
    endpoint: string,
    options?: {
      params?: HttpParams | Record<string, string | string[]>;
      headers?: HttpHeaders | Record<string, string | string[]>;
      reportProgress?: boolean;
    },
  ): Observable<T> {
    const headers = options?.headers || this.getAuthHeaders();
    return this.httpClient.get<T>(this.getFullUrl(endpoint), {
      params: options?.params,
      headers: headers,
      reportProgress: options?.reportProgress,
    } as any) as Observable<T>;
  }

  /**
   * Perform POST request
   * @param endpoint API endpoint
   * @param body Request body
   * @param options Optional HTTP options
   * @returns Observable of response
   */
  post<T>(
    endpoint: string,
    body: any,
    options?: {
      params?: HttpParams | Record<string, string | string[]>;
      headers?: HttpHeaders | Record<string, string | string[]>;
      reportProgress?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.post<T>(this.getFullUrl(endpoint), body, {
      ...options,
      headers: options?.headers || this.getAuthHeaders(),
    });
  }

  /**
   * Perform PATCH request
   * @param endpoint API endpoint
   * @param body Request body
   * @param options Optional HTTP options
   * @returns Observable of response
   */
  patch<T>(
    endpoint: string,
    body: any,
    options?: {
      params?: HttpParams | Record<string, string | string[]>;
      headers?: HttpHeaders | Record<string, string | string[]>;
      reportProgress?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.patch<T>(this.getFullUrl(endpoint), body, {
      ...options,
      headers: options?.headers || this.getAuthHeaders(),
    });
  }

  /**
   * Perform PUT request
   * @param endpoint API endpoint
   * @param body Request body
   * @param options Optional HTTP options
   * @returns Observable of response
   */
  put<T>(
    endpoint: string,
    body: any,
    options?: {
      params?: HttpParams | Record<string, string | string[]>;
      headers?: HttpHeaders | Record<string, string | string[]>;
      reportProgress?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.put<T>(this.getFullUrl(endpoint), body, {
      ...options,
      headers: options?.headers || this.getAuthHeaders(),
    });
  }

  /**
   * Perform DELETE request
   * @param endpoint API endpoint
   * @param options Optional HTTP options
   * @returns Observable of response
   */
  delete<T>(
    endpoint: string,
    options?: {
      params?: HttpParams | Record<string, string | string[]>;
      headers?: HttpHeaders | Record<string, string | string[]>;
      reportProgress?: boolean;
    },
  ): Observable<T> {
    return this.httpClient.delete<T>(this.getFullUrl(endpoint), {
      ...options,
      headers: options?.headers || this.getAuthHeaders(),
    });
  }
}
