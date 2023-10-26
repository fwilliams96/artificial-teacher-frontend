import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RolePlayComponent } from './container/role-play/role-play.component';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';
import { AudioRecorderModule } from 'src/app/shared/modules/audio-recorder/audio-recorder.module';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { RolePlayTypePipe } from './pipes/role-play-type.pipe';
import { RolePlayTypeModule } from 'src/app/shared/modules/role-play-type/role-play-type.module';

@NgModule({
  declarations: [
    RolePlayComponent,
    RolePlayTypePipe
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    AudioPlayerModule,
    AudioRecorderModule,
    RouterModule,
    RolePlayTypeModule
  ]
})
export class RolePlayModule { }
