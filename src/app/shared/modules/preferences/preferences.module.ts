import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesModalComponent } from './components/preferences-modal/preferences-modal.component';

@NgModule({
  declarations: [
    PreferencesModalComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [PreferencesModalComponent]
})
export class PreferencesModule { }
