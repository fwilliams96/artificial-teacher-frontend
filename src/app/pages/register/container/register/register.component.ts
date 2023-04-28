import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/modules/auth/interfaces/user';
import { AuthService } from 'src/app/shared/modules/auth/services/auth/auth.service';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup

  constructor(
    private readonly authService: AuthService,
    private fb: FormBuilder,
    private _router: Router,
    private readonly _infoToastService: InfoToastService,
    private readonly _dangerToastService: DangerToastService
  ) {
    this.registerForm = this.fb.group({
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
        ]
      ]
    });
  }

  get email() {
    return this.registerForm?.get('email') as FormControl;
  }

  get password() {
    return this.registerForm?.get('password') as FormControl;
  }

  get confirmPassword() {
    return this.registerForm?.get('confirmPassword') as FormControl;
  }

  onSubmit() {
    const user: User = {
      email: this.email.value,
      password: this.password.value
    };
    this.authService.register(user).subscribe(
      (response) => {
        this._infoToastService.show('¡Te has registrado correctamente!');
        this._router.navigate(['/login']);
      },
      (error) => {
        this._dangerToastService.show('Revisa que los datos introducidos sean correctos');
        console.log(error);
      }
    )
  }
}
