import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/modules/auth/services/auth/auth.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup

  constructor(
    private readonly authService: AuthService,
    private fb: FormBuilder,
    private _router: Router,
    private readonly _infoToastService: InfoToastService,
    private readonly _dangerToastService: DangerToastService
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]
      ],
      password: [
        '', 
        [
          Validators.required,
          Validators.minLength(8), 
          Validators.maxLength(12)
        ]]
    })
  }

  get email() {
    return this.loginForm.get('email') as FormControl
  }

  get password() {
    return this.loginForm.get('password') as FormControl
  }

  onSubmit() {
    this.authService.login(this.email.value, this.password.value).subscribe(
      (response) => {
        this._infoToastService.show(`¡Bienvenido ${this.email.value}!`)
        this._router.navigate(['/chat']);
      },
      (error) => {
        this._dangerToastService.show('Las credenciales son incorrectas');
        console.log(error);
      }
    )
  }

}
