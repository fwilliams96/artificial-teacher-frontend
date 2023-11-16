import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescriptionComponent } from './container/description/description.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';
import { AudioRecorderModule } from 'src/app/shared/modules/audio-recorder/audio-recorder.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [
    DescriptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AudioPlayerModule,
    AudioRecorderModule,
    FontAwesomeModule
  ]
})
export class DescriptionModule { }
