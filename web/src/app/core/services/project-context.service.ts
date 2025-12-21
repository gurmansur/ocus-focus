import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

/**
 * Service to manage current project context information
 * Centralizes project data retrieval and caching
 * Follows Dependency Inversion Principle - depends on StorageService abstraction
 */
@Injectable({
  providedIn: 'root',
})
export class ProjectContextService {
  private readonly PROJECT_ID_KEY = 'projeto_id';

  constructor(private storageService: StorageService) {}

  /**
   * Get current project ID from storage
   * @returns Project ID or null
   */
  getProjectId(): number | null {
    const id = this.storageService.getItem(this.PROJECT_ID_KEY);
    return id ? parseInt(id, 10) : null;
  }

  /**
   * Set current project ID in storage
   * @param projectId Project ID to store
   */
  setProjectId(projectId: number): void {
    this.storageService.setItem(this.PROJECT_ID_KEY, projectId.toString());
  }

  /**
   * Remove current project ID from storage
   */
  clearProjectId(): void {
    this.storageService.removeItem(this.PROJECT_ID_KEY);
  }

  /**
   * Check if a project is selected
   * @returns True if project ID is stored
   */
  hasProject(): boolean {
    return this.getProjectId() !== null;
  }
}
