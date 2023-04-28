import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { AuthService } from "../services/auth/auth.service";
import { Router } from "@angular/router";
import { InfoToastService } from "../../toast/services/info-toast/info-toast.service";

@Injectable()
export class HttpAuthRequestInterceptor implements HttpInterceptor {

    constructor(
        private readonly _authService: AuthService,
        private _router: Router,
        private readonly _infoToastService: InfoToastService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                console.log("barbie");
                
                // auto logout if 401 response returned from api
                this._authService.logout().subscribe(
                    (res) => {
                        this._infoToastService.show('La sesión ha caducado');
                        this._router.navigate(['/login']);
                    },
                    err => {
                        console.log(err);
                    },
                    () => {
                        this._infoToastService.show('La sesión ha caducado');
                        this._router.navigate(['/login']);
                    }
                );
            }

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

}