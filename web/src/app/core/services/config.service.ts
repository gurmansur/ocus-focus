import { Injectable } from '@angular/core';

/**
 * Service to manage application configuration
 * Centralizes configuration like API base URLs
 * Follows Single Responsibility Principle
 */
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private apiBaseUrl: string = 'http://localhost:3333';

  constructor() {
    // Can be overridden by environment configuration
    this.loadConfig();
  }

  /**
   * Load configuration from environment or defaults
   */
  private loadConfig(): void {
    // In production, this could load from environment.prod.ts
    // For now, using default values
    if (typeof window !== 'undefined') {
      // Client-side only
      this.apiBaseUrl =
        (window as any)['__API_URL__'] || 'http://localhost:3333';
    }
  }

  /**
   * Get the API base URL
   * @returns API base URL
   */
  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  /**
   * Set the API base URL (useful for testing or dynamic configuration)
   * @param url API base URL
   */
  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
  }
}
