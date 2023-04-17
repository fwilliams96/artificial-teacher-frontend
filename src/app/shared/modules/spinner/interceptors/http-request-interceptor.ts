import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'
import { SpinnerService } from '../services/spinner.service';

/**
 * This class is for intercepting http requests. When a request starts, we set the loadingSub property
 * in the LoadingService to true. Once the request completes and we have a response, set the loadingSub
 * property to false. If an error occurs while servicing the request, set the loadingSub property to false.
 * @class {HttpRequestInterceptor}
 */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private _spinnerService: SpinnerService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('hola miarma')
    this._spinnerService.setLoading(true, request.url);
    return next.handle(request).pipe(tap(async (event: HttpEvent < any > ) => {
        if (event instanceof HttpResponse) {
            this._spinnerService.setLoading(false, request.url);
        }
    },
    (err: any) => {
        this._spinnerService.setLoading(false, request.url);
    }));
  }
}