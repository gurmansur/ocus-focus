import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './auth/auth.module';

@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        AuthModule], providers: [
        { provide: 'servicesRootUrl', useValue: 'http://localhost:3333' },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule {}
