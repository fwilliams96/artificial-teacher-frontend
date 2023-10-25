import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SpinnerService } from './shared/modules/spinner/services/spinner.service';
import { delay } from 'rxjs/operators';
import { UserService } from './shared/modules/user/services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'artificial-teacher-frontend';
  loading: boolean = false;

  constructor(
    private _spinnerService: SpinnerService,
    private readonly _userService: UserService
  ){ }

  ngOnInit() {
    this.listenToLoading();
  }

  ngAfterViewInit(): void {
    this._userService.getUser().subscribe(
      user => {
        
      },
      error => {
        console.log(error);
      }
    );
  }

  listenToLoading(): void {
    this._spinnerService.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
