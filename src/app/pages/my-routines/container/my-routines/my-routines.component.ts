import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Routine } from 'src/app/pages/my-routine/interfaces/routine';
import { MyRoutineService } from 'src/app/pages/my-routine/services/my-routine.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';

@Component({
  selector: 'app-my-routines',
  templateUrl: './my-routines.component.html',
  styleUrls: ['./my-routines.component.scss']
})
export class MyRoutinesComponent {

  routines: Routine[] = []

  constructor(
    private readonly _routineService: MyRoutineService,
    private readonly _dangerToastService: DangerToastService
  ) {}

  ngAfterViewInit(): void {
    this.getRoutines();
  }

  getRoutines() {
    this._routineService.getRoutines().subscribe(
      routines => {
        this.routines = routines;
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar las rutinas');
        console.log(err);
      }
    )
  }

  createRoutine() {
    this._routineService.createRoutine().subscribe(
      res => {
        this.getRoutines();
      },
      err => {
        console.log(err);
      }
    );
  }

}
