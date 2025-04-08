import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Notification,
  NotificationService,
  NotificationType,
} from '../services/notification.service';

/**
 * Componente que exibe as notificações da aplicação.
 * Implementa um sistema de notificações Toast para feedback ao usuário.
 */
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div
        *ngFor="let notification of activeNotifications"
        class="notification"
        [ngClass]="getNotificationClass(notification.type)"
        (click)="close(notification.id)"
      >
        <div class="notification-content">
          <div class="notification-message">{{ notification.message }}</div>
          <button
            class="notification-close"
            (click)="close(notification.id); $event.stopPropagation()"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .notifications-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
        max-width: 350px;
      }

      .notification {
        margin-bottom: 10px;
        padding: 15px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.3s ease, opacity 0.3s ease;
        animation: slide-in 0.3s ease-out;
      }

      .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .notification-message {
        flex-grow: 1;
        margin-right: 10px;
      }

      .notification-close {
        background: none;
        border: none;
        font-size: 20px;
        cursor: pointer;
        opacity: 0.5;
        transition: opacity 0.2s;
      }

      .notification-close:hover {
        opacity: 1;
      }

      .notification-success {
        background-color: #d4edda;
        color: #155724;
        border-left: 5px solid #28a745;
      }

      .notification-info {
        background-color: #d1ecf1;
        color: #0c5460;
        border-left: 5px solid #17a2b8;
      }

      .notification-warning {
        background-color: #fff3cd;
        color: #856404;
        border-left: 5px solid #ffc107;
      }

      .notification-error {
        background-color: #f8d7da;
        color: #721c24;
        border-left: 5px solid #dc3545;
      }

      @keyframes slide-in {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .notification-exit {
        animation: slide-out 0.3s ease-in forwards;
      }

      @keyframes slide-out {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `,
  ],
})
export class NotificationComponent implements OnInit, OnDestroy {
  /**
   * Lista de notificações ativas
   */
  activeNotifications: Notification[] = [];

  /**
   * Subject para controle de ciclo de vida dos observables
   */
  private destroy$ = new Subject<void>();

  constructor(private notificationService: NotificationService) {}

  /**
   * Inicializa os observables para escutar notificações
   */
  ngOnInit(): void {
    // Inscrição para novas notificações
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe((notification) => {
        this.addNotification(notification);
      });

    // Inscrição para fechamento de notificações
    this.notificationService.closeNotification$
      .pipe(takeUntil(this.destroy$))
      .subscribe((id) => {
        this.removeNotification(id);
      });
  }

  /**
   * Limpa as inscrições ao destruir o componente
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Adiciona uma nova notificação à lista
   */
  private addNotification(notification: Notification): void {
    this.activeNotifications = [...this.activeNotifications, notification];
  }

  /**
   * Remove uma notificação da lista pelo ID
   */
  private removeNotification(id: number): void {
    const notification = this.activeNotifications.find((n) => n.id === id);
    if (notification) {
      // Marca para animação de saída
      const element = document.querySelector(
        `.notification-${id}`
      ) as HTMLElement;
      if (element) {
        element.classList.add('notification-exit');
        setTimeout(() => {
          this.activeNotifications = this.activeNotifications.filter(
            (n) => n.id !== id
          );
        }, 300); // Tempo da animação
      } else {
        this.activeNotifications = this.activeNotifications.filter(
          (n) => n.id !== id
        );
      }
    }
  }

  /**
   * Fecha manualmente uma notificação
   */
  close(id: number): void {
    this.notificationService.close(id);
  }

  /**
   * Retorna as classes CSS para uma notificação com base no tipo
   */
  getNotificationClass(type: NotificationType): string {
    return `notification-${type}`;
  }
}
