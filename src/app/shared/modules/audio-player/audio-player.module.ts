import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './container/audio-player/audio-player.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
  declarations: [
    AudioPlayerComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [AudioPlayerComponent]
})
export class AudioPlayerModule { }
