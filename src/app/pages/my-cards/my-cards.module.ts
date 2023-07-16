import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCardsComponent } from './container/my-cards/my-cards.component';
import { AudioPlayerModule } from 'src/app/shared/modules/audio-player/audio-player.module';



@NgModule({
  declarations: [
    MyCardsComponent
  ],
  imports: [
    CommonModule,
    AudioPlayerModule
  ],
  exports: [MyCardsComponent]
})
export class MyCardsModule { }
