import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WarningComponent } from './components/warning/warning.component'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { SuccessComponent } from './components/success/success.component'
import { InfoComponent } from './components/info/info.component'
import { DangerComponent } from './components/danger/danger.component'

@NgModule({
  declarations: [WarningComponent, SuccessComponent, InfoComponent, DangerComponent],
  imports: [CommonModule, FontAwesomeModule, BrowserAnimationsModule],
  exports: [WarningComponent, SuccessComponent, InfoComponent, DangerComponent]
})
export class ToastModule {}
