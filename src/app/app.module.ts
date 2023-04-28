import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing'
import { HomeModule } from './pages/home/home.module';
import { RouterModule } from '@angular/router';
import { ChatModule } from './pages/chat/chat.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerModule } from './shared/modules/spinner/spinner.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './shared/modules/spinner/interceptors/http-request-interceptor';
import { HeaderModule } from './shared/modules/header/header.module';
import { HttpAuthRequestInterceptor } from './shared/modules/auth/interceptors/http-auth-request-interceptor';
import { LoginModule } from './pages/login/login.module';
import { RegisterModule } from './pages/register/register.module';
import { ToastModule } from "./shared/modules/toast/toast.module";

@NgModule({
    declarations: [
        AppComponent
    ],
    providers: [appRoutingProviders,
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: HttpAuthRequestInterceptor, multi: true }
    ],
    bootstrap: [AppComponent],
    imports: [
        routing,
        BrowserModule,
        RouterModule,
        HomeModule,
        ChatModule,
        FontAwesomeModule,
        SpinnerModule,
        HttpClientModule,
        HeaderModule,
        LoginModule,
        RegisterModule,
        ToastModule
    ]
})
export class AppModule { }
