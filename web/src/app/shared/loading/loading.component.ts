import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Tamanhos disponíveis para o indicador de carregamento
 */
export type LoadingSize = 'small' | 'medium' | 'large';

/**
 * Componente genérico de indicador de carregamento.
 * Pode ser reutilizado em toda a aplicação para indicar operações em andamento.
 */
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="loading-container" 
      [class.loading-overlay]="overlay" 
      [class.loading-inline]="!overlay"
      [ngStyle]="{ 'background-color': overlay ? overlayColor : 'transparent' }"
    >
      <div 
        class="loading-spinner" 
        [ngClass]="['loading-' + size]" 
        [ngStyle]="{ 'border-top-color': color }"
      ></div>
      <span 
        *ngIf="text" 
        class="loading-text"
        [ngStyle]="{ 'color': textColor }"
      >{{ text }}</span>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999;
      background-color: rgba(255, 255, 255, 0.7);
    }
    
    .loading-inline {
      padding: 1rem;
    }
    
    .loading-spinner {
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top-color: #3498db;
      animation: spin 1s ease-in-out infinite;
    }
    
    .loading-small {
      width: 20px;
      height: 20px;
    }
    
    .loading-medium {
      width: 30px;
      height: 30px;
    }
    
    .loading-large {
      width: 50px;
      height: 50px;
    }
    
    .loading-text {
      margin-top: 10px;
      font-size: 14px;
      color: #333;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingComponent {
  /**
   * Determina se o carregamento aparece como overlay ou inline
   */
  @Input() overlay = false;
  
  /**
   * Texto a ser exibido abaixo do spinner
   */
  @Input() text?: string;
  
  /**
   * Cor do spinner
   */
  @Input() color = '#3498db';
  
  /**
   * Cor do texto
   */
  @Input() textColor = '#333';
  
  /**
   * Cor do fundo quando em modo overlay
   */
  @Input() overlayColor = 'rgba(255, 255, 255, 0.7)';
  
  /**
   * Tamanho do spinner
   */
  @Input() size: LoadingSize = 'medium';
} 