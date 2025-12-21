import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * Service to manage authentication tokens
 * Handles token storage, retrieval, and validation
 * Follows Single Responsibility Principle - only manages token operations
 */
@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'token';

  constructor(private storageService: StorageService) {}

  /**
   * Get the stored authentication token
   * @returns Token string or null if not found
   */
  getToken(): string | null {
    return this.storageService.getItem(this.TOKEN_KEY);
  }

  /**
   * Store authentication token
   * @param token Token to store
   */
  setToken(token: string): void {
    this.storageService.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove the authentication token
   */
  removeToken(): void {
    this.storageService.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check if token exists
   * @returns True if token is stored
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if token is valid (exists and not expired)
   * Note: This is a basic check. For JWT validation, use a JWT decode library
   * @returns True if token appears valid
   */
  isTokenValid(): boolean {
    return this.hasToken();
  }
}
