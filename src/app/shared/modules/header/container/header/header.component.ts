import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InfoToastService } from '../../../toast/services/info-toast/info-toast.service';
import {
  faUser
} from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../../user/services/auth/auth.service';
import { UserService } from '../../../user/services/user/user.service';
import { User } from '../../../user/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: User | undefined = undefined;

  isLogged$ = this._authService.isLoggedIn$;

  faUser = faUser

  constructor(
    private readonly _authService: AuthService,
    private readonly _userService: UserService,
    private readonly _infoToastService: InfoToastService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._authService.isLoggedInObs.subscribe(
      isLogged => {
        if (isLogged) {
          this._userService.getUser().subscribe(
            user => {
              this.user = user;
            },
            error => {
              console.log(error);
            }
          );
        }
        else {
          this.user = undefined;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  logout() {
    this._authService.logout().subscribe(
      res => {
        this._infoToastService.show("Te has desconectado");
        this._router.navigate(['/login']);
      },
      error => {
        console.log(error);
      },
      () => {
        this._infoToastService.show("Te has desconectado");
        this._router.navigate(['/login']);
      },
    );
  }

  goToMyCards() {
    this._router.navigate(['/my-cards']);
  }

  goToMyRoutines() {
    this._router.navigate(['/my-routines']);
  }

}
