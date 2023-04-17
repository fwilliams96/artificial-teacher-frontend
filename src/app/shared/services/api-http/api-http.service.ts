import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpErrorResponse
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { ErrorEntity } from 'src/app/shared/interfaces/error-entity'
import { SuccessEntity } from 'src/app/shared/interfaces/success-entity'

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {
  constructor(private readonly http: HttpClient) {}

  public getConfig<T>(route: string): Observable<T> {
    return this.http.get<T>(route)
  }

  /**
   * Method to get data
   *
   * @param route
   * @param params - Additional HttpParams
   */
  public get<T>(route: string, params?: HttpParams): Observable<T> {
    return this.http.get<T>(
      this.createCompleteRoute(route, environment.backendDomain),
      this.generateHeaders(params)
    )
  }
  /**
   * Method to post data
   *
   * @param route
   * @param body
   * @param params - Additional HttpParams
   */
  public post<T>(
    route: string,
    body: T,
    params?: HttpParams
  ): Observable<SuccessEntity<T>> {
    return this.http.post<SuccessEntity<T>>(
      this.createCompleteRoute(route, environment.backendDomain),
      body,
      this.generateHeaders(params)
    )
  }

  /**
   * Method to update data
   *
   * @param route
   * @param body
   * @param params - Additional HttpParams
   */
  public put<T>(
    route: string,
    body: T,
    params?: HttpParams
  ): Observable<SuccessEntity<T>> {
    return this.http.put<SuccessEntity<T>>(
      this.createCompleteRoute(route, environment.backendDomain),
      body,
      this.generateHeaders(params)
    )
  }

  /**
   * Method to delete data
   *
   * @param route
   * @param body
   */
  public delete<T>(
    route: string,
    params?: HttpParams
  ): Observable<SuccessEntity<T>> {
    return this.http.delete<SuccessEntity<T>>(
      this.createCompleteRoute(route, environment.backendDomain),
      this.generateHeaders(params)
    )
  }

  /**
   * Method to create complete route
   *
   * @param route // api url controller
   * @param envAddress // base url
   */
  private createCompleteRoute(route: string, envAddress: string) {
    return `${envAddress}${route}`
  }

  /**
   * Method to generate headers
   */
  private generateHeaders(params?: HttpParams) {
    return {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params
    }
  }

  /*private generateHeaders(params?: HttpParams) {
    return {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${this.getToken()}`),
      params
    }
  }*/

  private getToken() {
    return sessionStorage.getItem('access_token')
  }

  /**
   * Method to replace param to value
   *
   * @param urlApi
   * @param param param to change in url
   * @param value variable to change
   * @returns url with idPolicy
   */
  public replaceUrl(urlApi: string, param: string, value: any): string {
    return urlApi.replace(param, value.toString())
  }

  /**
   * Method to emit error message according to HttpStatus
   *
   * @param error
   */
  public throwErrorApi(error: HttpErrorResponse) {
    let errorApi = []
    if (error.status === 500) {
      errorApi.push(error.error)
    } else if (error.status === 0) {
      errorApi.push(error)
    } else {
      errorApi = error.error.errors
    }
    return errorApi
  }

  /**
   * Method to extract error entity from HttpErrorResponse
   */
  public getErrorEntity(error: HttpErrorResponse): ErrorEntity {
    return error.error
  }
}
