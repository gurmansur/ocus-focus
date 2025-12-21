import { Injectable } from '@angular/core';

/**
 * Service to handle browser storage operations (localStorage/sessionStorage)
 * Abstraction layer for storage to allow easy switching between implementations
 * and improve testability
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  /**
   * Get item from localStorage
   * @param key Storage key
   * @returns Stored value or null
   */
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Set item in localStorage
   * @param key Storage key
   * @param value Value to store
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Remove item from localStorage
   * @param key Storage key
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    localStorage.clear();
  }
}
