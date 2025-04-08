import { Injectable } from '@angular/core';

/**
 * Serviço responsável por gerenciar o armazenamento local de dados
 * como tokens de autenticação e preferências do usuário.
 * Centraliza o acesso ao localStorage para melhor manutenção e segurança.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TOKEN_KEY = 'token';
  private readonly SIDEBAR_STATE_KEY = 'sidebarState';

  /**
   * Obtém o token de autenticação do armazenamento local
   * @returns O token de autenticação ou null se não existir
   */
  getToken(): string | null {
    return this.getItem(this.TOKEN_KEY);
  }

  /**
   * Armazena o token de autenticação no armazenamento local
   * @param token O token a ser armazenado
   */
  setToken(token: string): void {
    this.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove o token de autenticação do armazenamento local
   */
  removeToken(): void {
    this.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se existe um token no armazenamento local
   * @returns true se o token existir, false caso contrário
   */
  hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtém o estado da sidebar do armazenamento local
   * @returns true se a sidebar estiver expandida, false caso contrário
   */
  getSidebarState(): boolean {
    const state = this.getItem(this.SIDEBAR_STATE_KEY);
    return state === 'true';
  }

  /**
   * Armazena o estado da sidebar no armazenamento local
   * @param expanded Estado de expansão da sidebar
   */
  setSidebarState(expanded: boolean): void {
    this.setItem(this.SIDEBAR_STATE_KEY, expanded.toString());
  }

  /**
   * Armazena um valor no localStorage
   * @param key Chave para armazenamento
   * @param value Valor a ser armazenado
   */
  setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Erro ao armazenar item no localStorage:', error);
    }
  }

  /**
   * Obtém um valor do localStorage
   * @param key Chave do valor a ser recuperado
   * @returns O valor armazenado ou null se não existir
   */
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Erro ao recuperar item do localStorage:', error);
      return null;
    }
  }

  /**
   * Armazena um objeto no localStorage
   * @param key Chave para armazenamento
   * @param value Objeto a ser armazenado
   */
  setObject<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      this.setItem(key, serialized);
    } catch (error) {
      console.error('Erro ao armazenar objeto no localStorage:', error);
    }
  }

  /**
   * Obtém um objeto do localStorage
   * @param key Chave do objeto a ser recuperado
   * @returns O objeto armazenado ou null se não existir ou ocorrer erro
   */
  getObject<T>(key: string): T | null {
    try {
      const serialized = this.getItem(key);
      if (!serialized) return null;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error('Erro ao recuperar objeto do localStorage:', error);
      return null;
    }
  }

  /**
   * Remove um valor do localStorage
   * @param key Chave do valor a ser removido
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erro ao remover item do localStorage:', error);
    }
  }

  /**
   * Limpa todos os dados armazenados no localStorage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  }
}
