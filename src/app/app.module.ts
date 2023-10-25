import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routing'
import { HomeModule } from './pages/home/home.module';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerModule } from './shared/modules/spinner/spinner.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpRequestInterceptor } from './shared/modules/spinner/interceptors/http-request-interceptor';
import { HeaderModule } from './shared/modules/header/header.module';
import { LoginModule } from './pages/login/login.module';
import { RegisterModule } from './pages/register/register.module';
import { ToastModule } from "./shared/modules/toast/toast.module";
import { ListeningModule } from './pages/listening/listening.module';
import { ChatModule } from './pages/chat/chat.module';
import { MyCardsModule } from './pages/my-cards/my-cards.module';
import { PreferencesModule } from './shared/modules/preferences/preferences.module';
import { AudioPlayerModule } from './shared/modules/audio-player/audio-player.module';
import { FreeChatModule } from './pages/free-chat/free-chat.module';
import { MyRoutineModule } from './pages/my-routine/my-routine.module';
import { MyRoutinesModule } from './pages/my-routines/my-routines.module';
import { RolePlayModule } from './pages/role-play/role-play.module';
import { WallOfFameModule } from './pages/wall-of-fame/wall-of-fame.module';
import { HttpAuthRequestInterceptor } from './shared/modules/user/interceptors/http-auth-request-interceptor';
import { PronunciationModule } from './pages/pronunciation/pronunciation.module';

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
        FreeChatModule,
        ListeningModule,
        FontAwesomeModule,
        SpinnerModule,
        HttpClientModule,
        HeaderModule,
        LoginModule,
        RegisterModule,
        MyCardsModule,
        MyRoutineModule,
        MyRoutinesModule,
        ToastModule,
        PreferencesModule,
        RolePlayModule,
        WallOfFameModule,
        PronunciationModule
    ]
})
export class AppModule { }
