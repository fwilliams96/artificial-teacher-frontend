import { Component } from '@angular/core';
import { Routine } from '../../interfaces/routine';
import { MyRoutineService } from '../../services/my-routine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';

@Component({
  selector: 'app-my-routine',
  templateUrl: './my-routine.component.html',
  styleUrls: ['./my-routine.component.scss']
})
export class MyRoutineComponent {

  id_routine: string | null = null;

  routine: Routine | undefined = undefined

  constructor(
    private readonly _routineService: MyRoutineService,
    private readonly _dangerToastService: DangerToastService,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit(): void {
    this.recoverRoutine();
  }

  recoverRoutine() {
    this.id_routine = this.route.snapshot.paramMap.get('id');
    if (!this.id_routine) return;

    this._routineService.getRoutine(this.id_routine).subscribe(
      routine => {
        this.routine = routine;
      },
      err => {
        this._dangerToastService.show('Ha habido un error al recuperar el listening');
        console.log(err);
      }
    )
  }
}
