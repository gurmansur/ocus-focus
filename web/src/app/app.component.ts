import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

/**
 * Componente raiz da aplicação.
 * Ponto de entrada principal para a renderização da aplicação.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  /** Título da aplicação */
  title = 'Ocus Focus';

  /**
   * Construtor do componente
   * @param primengConfig Configuração do PrimeNG
   */
  constructor(private primengConfig: PrimeNGConfig) {}

  /**
   * Inicializa o componente
   * Configura o efeito ripple do PrimeNG
   */
  ngOnInit(): void {
    // Ativa o efeito de ondulação nos componentes do PrimeNG
    this.primengConfig.ripple = true;
  }
}
