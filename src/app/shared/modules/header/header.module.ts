import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './container/header/header.component';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    NgbProgressbarModule,
    FontAwesomeModule
  ],
  exports: [HeaderComponent]
})
export class HeaderModule { }
