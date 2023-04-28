import { Component } from '@angular/core';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { Router } from '@angular/router';
import { SuccessToastService } from '../../../toast/services/success-toast/success-toast.service';
import { InfoToastService } from '../../../toast/services/info-toast/info-toast.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private readonly _authService: AuthService,
    private readonly _infoToastService: InfoToastService,
    private _router: Router
  ) {}

  isLogged$ = this._authService.isLoggedIn$;

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

}
