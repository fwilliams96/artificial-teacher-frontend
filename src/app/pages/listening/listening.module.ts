import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListeningComponent } from './container/listening/listening.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ListeningService } from './services/listening/listening.service';

@NgModule({
  declarations: [
    ListeningComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [ListeningService]
})
export class ListeningModule { }
