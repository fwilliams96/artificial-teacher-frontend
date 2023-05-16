import { Injectable } from '@angular/core';
import { ServerContext } from '../../interfaces/server-context';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { UserMessage } from '../../interfaces/user-message';
import { ServerMessage } from '../../interfaces/server-message';
import { ContentType } from '../../interfaces/content-type';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private endpointUrl = '/chat';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  startConversation(userMessage: UserMessage): Observable<ServerContext> {
    return this.apiHttpService.postJsonAndReceiveJson<UserMessage, ServerContext>(
      this.endpointUrl,
      userMessage
    )
  }

  sendMessage(contextId: string, message: UserMessage, responseType: ContentType = ContentType.TEXT): Observable<ServerMessage[]> {
    return this.apiHttpService.postJsonAndReceiveJson<UserMessage, ServerMessage[]>(
      `${this.endpointUrl}/${contextId}`,
      message,
      new HttpParams().append('response_type', responseType)
    )
  }

}
