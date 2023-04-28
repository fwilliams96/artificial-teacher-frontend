import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http'
import { Observable } from 'rxjs'
import { environment } from 'src/environments/environment'
import { SuccessEntity } from 'src/app/shared/interfaces/success-entity'

@Injectable({
  providedIn: 'root'
})
export class ApiHttpService {
  constructor(
    private readonly http: HttpClient
    ) {}

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
      this.generateJsonHeaders(params)
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
      this.generateJsonHeaders(params)
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
      this.generateJsonHeaders(params)
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
      this.generateJsonHeaders(params)
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
  private generateJsonHeaders(params?: HttpParams) {
    return {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params
    }
  }

  /***************************************************************************** */

  public postJsonAndReceiveJson<T>(
    route: string,
    body: T,
    params?: HttpParams
  ): Observable<T> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.post<T>(
      this.createCompleteRoute(route, environment.backendDomain),
      body,
      { headers: this.getHeaders(), params }
    )
  }

  public postJsonAndReceiveFile<I>(
    route: string,
    body: I,
    params?: HttpParams
  ): Observable<Blob> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post(
      this.createCompleteRoute(route, environment.backendDomain),
      body,
      { headers: this.getHeaders(), params, responseType: 'blob'}
    )
  }

  public postFormDataAndReceiveJson<T> (
    route: string,
    formData: FormData,
    params?: HttpParams
  ): Observable<T> {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    return this.http.post<T>(
      this.createCompleteRoute(route, environment.backendDomain),
      formData,
      { headers: this.getHeaders(), params }
    )
  }

  public postFormDataAndReceiveFile(
    route: string,
    body: FormData,
    params?: HttpParams
  ): Observable<Blob> {
    return this.http.post(
      this.createCompleteRoute(route, environment.backendDomain),
      body,
      { headers: this.getHeaders(), params, responseType: 'blob'}
    )
  }

  public getHeaders(): HttpHeaders {
    const token = this.getToken();
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    }
    return new HttpHeaders();
  }

  isLogged() {
    return localStorage.getItem('access_token') != null;
  }

  getToken(): string | null {
    if (this.isLogged()) {
      return localStorage.getItem('access_token');
    }
    return null;
  }

  saveToken(token: string) {
    localStorage.setItem('access_token', token);
  }

  removeToken() {
    localStorage.removeItem('access_token');
  }
}
