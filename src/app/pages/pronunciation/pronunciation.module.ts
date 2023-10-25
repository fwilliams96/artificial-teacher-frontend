import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PronunciationComponent } from './container/pronunciation/pronunciation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';
import { AudioRecorderModule } from 'src/app/shared/modules/audio-recorder/audio-recorder.module';

@NgModule({
  declarations: [
    PronunciationComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    AudioPlayerModule,
    AudioRecorderModule
  ]
})
export class PronunciationModule { }
