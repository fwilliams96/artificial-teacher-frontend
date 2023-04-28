/* eslint-disable @typescript-eslint/no-empty-function */
import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations'
import { Component, EventEmitter, OnInit, Output } from '@angular/core'
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import { SuccessToastService } from '../../services/success-toast/success-toast.service'
import { ToastEvent } from '../../interfaces/toast-event'

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css'],
  animations: [
    trigger('fadeSlideInOut', [
      transition(':enter', [
        animate(
          '1s ease',
          keyframes([
            style({ transform: 'translate(-50%, -100%)', offset: 0.0 }),
            style({ transform: 'translate(-50%, -10px)', offset: 0.4 }),
            style({ transform: 'translate(-50%, 10px)', offset: 0.8 }),
            style({ transform: 'translate(-50%, 0px)', offset: 1.0 })
          ])
        )
      ]),
      transition(':leave', [
        animate(
          '1s ease',
          keyframes([
            style({ transform: 'translate(-50%, 0px)', offset: 0.0 }),
            style({ transform: 'translate(-50%, 10px)', offset: 0.4 }),
            style({ transform: 'translate(-50%, -10px)', offset: 0.8 }),
            style({ transform: 'translate(-50%, -100%)', offset: 1.0 })
          ])
        )
      ])
    ])
  ]
})
export class SuccessComponent implements OnInit {
  faCheckCircle = faCheckCircle
  faTimes = faTimes

  show = false
  message = ''
  seconds = 3

  @Output()
  onClose: EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor(private successToastService: SuccessToastService) {}

  ngOnInit(): void {
    this.successToastService.toastEventObservable.subscribe(
      (toastEvent: ToastEvent) => {
        this.show = toastEvent.show
        this.message = toastEvent.message
        if (toastEvent.seconds && toastEvent.seconds > 0) {
          this.seconds = toastEvent.seconds
        }
      }
    )
  }

  closeToast() {
    this.successToastService.hide()
    this.onClose.emit(true)
  }

  onDone($event: any) {
    if (this.show) {
      setTimeout(() => {
        this.closeToast()
      }, this.seconds * 1000)
    }
  }
}
