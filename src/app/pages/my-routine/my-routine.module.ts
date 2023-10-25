import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRoutineComponent } from './container/my-routine/my-routine.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MyRoutineComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class MyRoutineModule { }
