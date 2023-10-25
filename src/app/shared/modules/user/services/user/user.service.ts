import { Injectable } from '@angular/core';
import { User } from '../../interfaces/user';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Observable, Subject } from 'rxjs';
import { NewUser } from '../../interfaces/new_user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user$ = new Subject<User|undefined>();
  userObs = this.user$.asObservable();

  private endpointUrl = '/users';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  register(user: NewUser): Observable<User> {
    return this.apiHttpService.postJsonAndReceiveJson<NewUser, User>(
      `${this.endpointUrl}`,
      user
    );
  }

  getUser(): Observable<User> {
    return new Observable(obs => {
      return this.apiHttpService.getAndReceiveJson<User>(
        this.endpointUrl
      ).subscribe(
        response => {
          this.user$.next(response);
          obs.next(response);
        },
        error => {
          obs.error(error);
        }
      );
    });
    
  }

  getWallOfFame(): Observable<User[]> {
    return this.apiHttpService.getAndReceiveJson<User[]>(
      `${this.endpointUrl}/wall-of-fame`
    )
  }
}
