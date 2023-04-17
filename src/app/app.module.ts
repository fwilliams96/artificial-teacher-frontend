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

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    routing,
    BrowserModule,
    RouterModule,
    HomeModule,
    ChatModule,
    FontAwesomeModule,
    SpinnerModule,
    HttpClientModule
  ],
  providers: [appRoutingProviders, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
