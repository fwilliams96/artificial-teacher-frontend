import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FreeChatComponent } from './container/free-chat/free-chat.component';
import { FreeChatService } from './services/free-chat.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';
import { AudioRecorderModule } from 'src/app/shared/modules/audio-recorder/audio-recorder.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    FreeChatComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    AudioPlayerModule,
    AudioRecorderModule,
    RouterModule
  ],
  providers: [FreeChatService]
})
export class FreeChatModule { }
