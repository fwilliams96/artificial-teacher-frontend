import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Auth } from '../../interfaces/auth';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isLoggedIn$ = new BehaviorSubject<boolean>(this._apiHttpService.isLogged());
  isLoggedInObs = this.isLoggedIn$.asObservable();

  authEndpointUrl = '/auth'
  usersEndpointUrl = '/users'

  constructor(
    private _apiHttpService: ApiHttpService
  ) {}

  login(email: string, password: string): Observable<Auth> {
    const formData: FormData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    return new Observable(obs => {
      this._apiHttpService.postFormDataAndReceiveJson<Auth>(
        `${this.authEndpointUrl}/login`,
        formData
      ).subscribe(
        response => {
          this._apiHttpService.saveToken(response.access_token);
          this.isLoggedIn$.next(true);
          obs.next(response);
        },
        err => {
          obs.error(err);
        }
      );
    });

  }

  logout(): Observable<any> {
    this._apiHttpService.removeToken();
    return new Observable((observer) => {
      this.isLoggedIn$.next(false);
      observer.complete();
    })    
  }
  
  register(user: User): Observable<User> {
    return this._apiHttpService.postJsonAndReceiveJson<User, User>(
      `${this.usersEndpointUrl}`,
      user
    );
  }
}
