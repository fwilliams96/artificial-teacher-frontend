import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SuccessEntity } from 'src/app/shared/interfaces/success-entity';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Message, MessageType } from '../../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private endpointUrl = '/chat'

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  sendMessage(content: string, conversationId?: string): Observable<SuccessEntity<Message>> {

    const message: Message = {
      content,
      date: new Date().toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid' }),
      type: MessageType.Sent,
      conversationId
    }

    return this.apiHttpService.post<Message>(
      this.endpointUrl,
      message
    )
  }


}
