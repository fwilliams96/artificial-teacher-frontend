import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './container/spinner/spinner.component';
import { SpinnerService } from './services/spinner.service';
import { HttpRequestInterceptor } from './interceptors/http-request-interceptor';

@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [SpinnerComponent],
  providers: [SpinnerService]
})
export class SpinnerModule { }
