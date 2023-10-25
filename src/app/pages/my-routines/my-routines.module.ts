import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRoutinesComponent } from './container/my-routines/my-routines.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MyRoutinesComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [MyRoutinesComponent]
})
export class MyRoutinesModule { }
