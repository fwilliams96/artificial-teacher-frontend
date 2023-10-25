import { Injectable } from '@angular/core';
import { FreeChatMessage } from '../interfaces/free-chat-message';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { HttpParams } from '@angular/common/http';
import { FreeChat } from '../interfaces/free-chat';

@Injectable({
  providedIn: 'root'
})
export class FreeChatService {

  private endpointUrl = '/free-chat';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  startChat(): Observable<FreeChat> {
    return this.apiHttpService.postJsonAndReceiveJson<{}, FreeChat>(
      this.endpointUrl,
      {}
    )
  }

  endChat(chatId: string): Observable<FreeChat> {
    return this.apiHttpService.postJsonAndReceiveJson<{}, FreeChat>(
      `${this.endpointUrl}/${chatId}/finish`,
      {}
    )
  }

  recoverChat(chatId: string): Observable<FreeChat> {
    return this.apiHttpService.getAndReceiveJson<FreeChat>(
      `${this.endpointUrl}/${chatId}`
    )
  }

  sendMessage(chatId: string, userMessage: FreeChatMessage, responseInSpeech = false): Observable<FreeChatMessage[]> {
    return this.apiHttpService.postJsonAndReceiveJson<FreeChatMessage, FreeChatMessage[]>(
      `${this.endpointUrl}/${chatId}`,
      userMessage,
      new HttpParams().append('response_in_speech', responseInSpeech)
    )
  }

}
