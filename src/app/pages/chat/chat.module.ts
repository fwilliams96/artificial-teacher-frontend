import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './container/chat/chat.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { ChatTextService } from './services/chat-text/chat-text.service';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [ChatTextService]
})
export class ChatModule { }
