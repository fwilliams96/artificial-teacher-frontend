import { Injectable } from '@angular/core';
import { Context } from '../../interfaces/context';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Message } from '../../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private endpointUrl = '/chat';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  startConversation(context: Context): Observable<Context> {
    return this.apiHttpService.postJsonAndReceiveJson<Context>(
      this.endpointUrl,
      context
    )
  }

  sendTextAndReceiveText(contextId: string, message: Message): Observable<Message> {
    return this.apiHttpService.postJsonAndReceiveJson<Message>(
      `${this.endpointUrl}/${contextId}/text-text`,
      message
    )
  }

  sendTextAndReceiveVoice(contextId: string, message: Message): Observable<Blob> {
    return this.apiHttpService.postJsonAndReceiveFile<Message>(
      `${this.endpointUrl}/${contextId}/text-voice`,
      message
    )
  }

  sendVoiceAndReceiveText(contextId: string, audioBlob: Blob): Observable<Message> {
    const formData: FormData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("context_id", contextId);
    return this.apiHttpService.postFileAndReceiveJson<Message>(
      `${this.endpointUrl}/${contextId}/voice-text`,
      formData
    )
  }

  sendVoiceAndReceiveVoice(contextId: string, audioBlob: Blob): Observable<Blob> {
    const formData: FormData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("context_id", contextId);
    return this.apiHttpService.postFileAndReceiveFile(
      `${this.endpointUrl}/${contextId}/voice-voice`,
      formData
    )
  }
}
