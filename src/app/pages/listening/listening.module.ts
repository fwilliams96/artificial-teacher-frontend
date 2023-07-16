import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeningComponent } from './container/listening/listening.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ListeningService } from './services/listening/listening.service';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';

@NgModule({
  declarations: [
    ListeningComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    AudioPlayerModule
  ],
  providers: [ListeningService]
})
export class ListeningModule { }
