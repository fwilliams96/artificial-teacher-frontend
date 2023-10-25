import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePlayComponent } from './container/role-play/role-play.component';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';
import { AudioRecorderModule } from 'src/app/shared/modules/audio-recorder/audio-recorder.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    RolePlayComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    AudioPlayerModule,
    AudioRecorderModule,
    RouterModule
  ]
})
export class RolePlayModule { }
