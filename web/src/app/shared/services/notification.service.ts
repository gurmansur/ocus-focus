import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Tipos de notificações disponíveis
 */
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

/**
 * Interface para representar uma notificação
 */
export interface Notification {
  id: number;
  type: NotificationType;
  message: string;
  duration?: number;
  autoClose?: boolean;
}

/**
 * Serviço responsável por gerenciar as notificações da aplicação.
 * Implementa o padrão Observable para comunicação entre componentes.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * Subject que emite as notificações criadas
   */
  private notificationsSubject = new Subject<Notification>();
  
  /**
   * Subject que emite a solicitação para fechar uma notificação
   */
  private closeNotificationSubject = new Subject<number>();
  
  /**
   * Contador para gerar IDs únicos para notificações
   */
  private idCounter = 0;
  
  /**
   * Duração padrão das notificações (em milissegundos)
   */
  private defaultDuration = 5000;

  /**
   * Observable que emite as notificações criadas
   */
  get notifications$(): Observable<Notification> {
    return this.notificationsSubject.asObservable();
  }

  /**
   * Observable que emite a solicitação para fechar uma notificação
   */
  get closeNotification$(): Observable<number> {
    return this.closeNotificationSubject.asObservable();
  }

  /**
   * Exibe uma notificação de sucesso
   * @param message Mensagem da notificação
   * @param duration Duração da notificação em milissegundos (opcional)
   * @returns ID da notificação criada
   */
  success(message: string, duration?: number): number {
    return this.show({
      id: ++this.idCounter,
      type: 'success',
      message,
      duration: duration || this.defaultDuration,
      autoClose: true
    });
  }

  /**
   * Exibe uma notificação informativa
   * @param message Mensagem da notificação
   * @param duration Duração da notificação em milissegundos (opcional)
   * @returns ID da notificação criada
   */
  info(message: string, duration?: number): number {
    return this.show({
      id: ++this.idCounter,
      type: 'info',
      message,
      duration: duration || this.defaultDuration,
      autoClose: true
    });
  }

  /**
   * Exibe uma notificação de alerta
   * @param message Mensagem da notificação
   * @param duration Duração da notificação em milissegundos (opcional)
   * @returns ID da notificação criada
   */
  warning(message: string, duration?: number): number {
    return this.show({
      id: ++this.idCounter,
      type: 'warning',
      message,
      duration: duration || this.defaultDuration,
      autoClose: true
    });
  }

  /**
   * Exibe uma notificação de erro
   * @param message Mensagem da notificação
   * @param duration Duração da notificação em milissegundos (opcional)
   * @returns ID da notificação criada
   */
  error(message: string, duration?: number): number {
    return this.show({
      id: ++this.idCounter,
      type: 'error',
      message,
      duration: duration || this.defaultDuration,
      autoClose: true
    });
  }

  /**
   * Exibe uma notificação personalizada
   * @param notification Notificação a ser exibida
   * @returns ID da notificação criada
   */
  show(notification: Notification): number {
    // Garante que a notificação tenha um ID
    if (!notification.id) {
      notification.id = ++this.idCounter;
    }
    
    this.notificationsSubject.next(notification);
    
    // Configura fechamento automático se solicitado
    if (notification.autoClose && notification.duration) {
      setTimeout(() => {
        this.close(notification.id);
      }, notification.duration);
    }
    
    return notification.id;
  }

  /**
   * Fecha uma notificação específica
   * @param id ID da notificação a ser fechada
   */
  close(id: number): void {
    this.closeNotificationSubject.next(id);
  }

  /**
   * Define a duração padrão das notificações
   * @param duration Duração em milissegundos
   */
  setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }
} 