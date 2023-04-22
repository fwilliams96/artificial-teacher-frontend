import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Message } from '../../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatTextService {

  private endpointUrl = '/chat-text';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  sendTextAndReceiveText(contextId: string, message: Message): Observable<Message> {
    return this.apiHttpService.postWithoutSuccessEntity<Message>(
      `${this.endpointUrl}/${contextId}/text`,
      message
    )
  }

  sendTextAndReceiveVoice(contextId: string, message: Message): Observable<Message> {
    return this.apiHttpService.postWithoutSuccessEntity<Message>(
      `${this.endpointUrl}/${contextId}/voice`,
      message
    )
  }

}
