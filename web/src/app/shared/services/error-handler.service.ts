import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

/**
 * Serviço responsável por gerenciar e padronizar o tratamento de
 * erros em toda a aplicação.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  /**
   * Processa erros HTTP e gera mensagens amigáveis para o usuário.
   *
   * @param error Erro HTTP recebido
   * @param operacao Operação que falhou (opcional)
   * @returns Um Observable que lança o erro processado
   */
  handleHttpError(
    error: HttpErrorResponse,
    operacao = 'operação'
  ): Observable<never> {
    let mensagemErro = '';

    if (error.status === 0) {
      // Erro de conexão ou do cliente
      mensagemErro = `Erro de conexão: Verifique sua conexão com a internet.`;
      console.error('Erro de conexão:', error);
    } else if (error.status === 401) {
      // Erro de autenticação
      mensagemErro = 'Sessão expirada. Por favor, faça login novamente.';
      console.error('Erro de autenticação:', error);
    } else if (error.status === 403) {
      // Erro de permissão
      mensagemErro = 'Você não tem permissão para realizar esta operação.';
      console.error('Erro de permissão:', error);
    } else if (error.status === 404) {
      // Recurso não encontrado
      mensagemErro = 'O recurso solicitado não foi encontrado.';
      console.error('Recurso não encontrado:', error);
    } else if (error.status >= 500) {
      // Erro do servidor
      mensagemErro = `Erro interno do servidor ao ${operacao}. Por favor, tente novamente mais tarde.`;
      console.error('Erro do servidor:', error);
    } else {
      // Outros erros
      mensagemErro =
        this.extrairMensagem(error) ||
        `Erro ao ${operacao}: ${error.status} ${error.statusText}`;
      console.error(`Erro ao ${operacao}:`, error);
    }

    // Retorna um Observable que emite erro
    return throwError(() => ({
      mensagem: mensagemErro,
      erro: error,
    }));
  }

  /**
   * Tenta extrair uma mensagem amigável de um erro HTTP.
   *
   * @param erro Objeto de erro HTTP
   * @returns Mensagem de erro extraída ou undefined se não for possível extrair
   */
  private extrairMensagem(erro: HttpErrorResponse): string | undefined {
    // Tenta extrair a mensagem do corpo da resposta
    if (erro.error) {
      // Se o erro contém uma propriedade 'mensagem'
      if (typeof erro.error === 'object' && 'mensagem' in erro.error) {
        return erro.error.mensagem as string;
      }

      // Se o erro contém uma propriedade 'message'
      if (typeof erro.error === 'object' && 'message' in erro.error) {
        return erro.error.message as string;
      }

      // Se o erro é uma string
      if (typeof erro.error === 'string') {
        return erro.error;
      }
    }

    // Retorna a mensagem padrão do erro se existir
    return erro.message;
  }
}
