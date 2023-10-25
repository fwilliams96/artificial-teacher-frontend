import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Routine } from '../interfaces/routine';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyRoutineService {

  private endpointUrl = '/user-routines';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  getRoutines(): Observable<Routine[]> {
    return this.apiHttpService.getAndReceiveJson<Routine[]>(
      this.endpointUrl
    )
  }

  getRoutine(id_routine: string): Observable<Routine> {
    return this.apiHttpService.getAndReceiveJson<Routine>(
      `${this.endpointUrl}/${id_routine}`
    )
  }

  createRoutine(): Observable<Routine> {
    return this.apiHttpService.postJsonAndReceiveJson<{}, Routine>(
      `${this.endpointUrl}`,
      {}
    );
  }
}
