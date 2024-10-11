import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ProjetoInterceptor } from './projeto/projeto.interceptor';
import { TokenInterceptor } from './token/token.interceptor';

@NgModule({
  providers: [
    ProjetoInterceptor,
    TokenInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProjetoInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
})
export class InterceptorModule {}
