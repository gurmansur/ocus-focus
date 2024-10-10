import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ProjetoInterceptor } from './projeto.interceptor';

@NgModule({
  providers: [
    ProjetoInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProjetoInterceptor,
      multi: true,
    },
  ],
})
export class ProjetoInterceptorModule {}
