import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DangerToastService } from 'src/app/shared/modules/toast/services/danger-toast/danger-toast.service';
import { InfoToastService } from 'src/app/shared/modules/toast/services/info-toast/info-toast.service';
import { NewUser } from 'src/app/shared/modules/user/interfaces/new_user';
import { User } from 'src/app/shared/modules/user/interfaces/user';
import { UserService } from 'src/app/shared/modules/user/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerForm: FormGroup

  constructor(
    private readonly userService: UserService,
    private fb: FormBuilder,
    private _router: Router,
    private readonly _infoToastService: InfoToastService,
    private readonly _dangerToastService: DangerToastService
  ) {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.pattern("/^[a-z ,.'-]+$")
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.pattern("/^[a-z ,.'-]+$")
        ]
      ],
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

  get firstName() {
    return this.registerForm?.get('firstName') as FormControl;
  }

  get lastName() {
    return this.registerForm?.get('lastName') as FormControl;
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
    const user: NewUser = {
      email: this.email.value,
      password: this.password.value,
      first_name: this.firstName.value,
      last_name: this.lastName.value
    };
    this.userService.register(user).subscribe(
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
