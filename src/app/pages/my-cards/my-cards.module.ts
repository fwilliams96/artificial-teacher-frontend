import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyCardsComponent } from './container/my-cards/my-cards.component';



@NgModule({
  declarations: [
    MyCardsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MyCardsComponent]
})
export class MyCardsModule { }
