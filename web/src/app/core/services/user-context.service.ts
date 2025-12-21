import { Injectable } from '@angular/core';
import { UserContext } from '../models/auth-response';
import { StorageService } from './storage.service';

/**
 * Service to manage current user context information
 * Centralizes user data retrieval and caching
 * Follows Dependency Inversion Principle - depends on StorageService abstraction
 */
@Injectable({
  providedIn: 'root',
})
export class UserContextService {
  private readonly USER_ID_KEY = 'usu_id';
  private readonly USER_EMAIL_KEY = 'usu_email';
  private readonly USER_NAME_KEY = 'usu_name';
  private readonly USER_ROLE_KEY = 'usu_role';

  constructor(private storageService: StorageService) {}

  /**
   * Get current user ID from storage
   * @returns User ID or null
   */
  getUserId(): number | null {
    const id = this.storageService.getItem(this.USER_ID_KEY);
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Get current user email from storage
   * @returns User email or null
   */
  getUserEmail(): string | null {
    return this.storageService.getItem(this.USER_EMAIL_KEY);
  }

  /**
   * Get current user name from storage
   * @returns User name or null
   */
  getUserName(): string | null {
    return this.storageService.getItem(this.USER_NAME_KEY);
  }

  /**
   * Get current user role from storage
   * @returns User role or null
   */
  getUserRole(): string | null {
    return this.storageService.getItem(this.USER_ROLE_KEY);
  }

  /**
   * Get complete user context
   * @returns Complete user context object or null if user not authenticated
   */
  getUserContext(): UserContext | null {
    const userId = this.getUserId();
    const email = this.getUserEmail();
    const name = this.getUserName();
    const role = this.getUserRole();

    if (!userId || !email || !name || !role) {
      return null;
    }

    return {
      token: '', // Token is managed by TokenService
      userId,
      email,
      name,
      role,
    };
  }

  /**
   * Store user context information
   * @param userId User ID
   * @param email User email
   * @param name User name
   * @param role User role
   */
  setUserContext(
    userId: number,
    email: string,
    name: string,
    role: string,
  ): void {
    this.storageService.setItem(this.USER_ID_KEY, userId.toString());
    this.storageService.setItem(this.USER_EMAIL_KEY, email);
    this.storageService.setItem(this.USER_NAME_KEY, name);
    this.storageService.setItem(this.USER_ROLE_KEY, role);
  }

  /**
   * Clear user context information
   */
  clearUserContext(): void {
    this.storageService.removeItem(this.USER_ID_KEY);
    this.storageService.removeItem(this.USER_EMAIL_KEY);
    this.storageService.removeItem(this.USER_NAME_KEY);
    this.storageService.removeItem(this.USER_ROLE_KEY);
  }

  /**
   * Check if user is authenticated
   * @returns True if user context is available
   */
  isAuthenticated(): boolean {
    return this.getUserId() !== null;
  }
}
