import { Component } from '@angular/core';
import {
  faPaperclip,
  faEllipsisV,
  faSearch
} from '@fortawesome/free-solid-svg-icons'
import { ChatService } from '../../services/chat/chat.service';
import { Message, MessageType } from '../../interfaces/message';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {

  faPaperclip = faPaperclip
  faEllipsisV = faEllipsisV
  faSearch = faSearch

  message = ''

  constructor(
    private readonly _chatService: ChatService
  ) {}

  messages: Message[] = [
    {
      type: MessageType.Received,
      content: 'Hola, ¿cómo estás?',
      date: '9:00 AM'
    },
    {
      type: MessageType.Sent,
      content: 'Muy bien, gracias por preguntar.',
      date: '9:05 AM'
    }
  ]

  sendMessage() {
    // console.log(this.message)
    this._chatService.sendMessage(this.message).subscribe(
      res => {
        this.addSentMessage(res.data)
      },
      err => {
        console.log(err)
      }
    )
  }

  addSentMessage(message: Message) {
    this.messages.push(message)
  }

}
