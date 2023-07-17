import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './container/chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ChatService } from './services/chat/chat.service';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';
import { AudioRecorderModule } from 'src/app/shared/modules/audio-recorder/audio-recorder.module';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    AudioPlayerModule,
    AudioRecorderModule
  ],
  providers: [ChatService]
})
export class ChatModule { }
