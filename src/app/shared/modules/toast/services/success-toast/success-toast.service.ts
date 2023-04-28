/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { ToastEvent } from '../../interfaces/toast-event'

@Injectable({
  providedIn: 'root'
})
export class SuccessToastService {
  toastEvent$ = new Subject<ToastEvent>()
  toastEventObservable = this.toastEvent$.asObservable()

  show(message: string): void {
    this.toastEvent$.next({
      show: true,
      message: message
    })
  }

  hide(): void {
    this.toastEvent$.next({
      show: false,
      message: ''
    })
  }

  constructor() {}
}
