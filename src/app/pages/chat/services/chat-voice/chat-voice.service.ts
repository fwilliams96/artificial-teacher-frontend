import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Message } from '../../interfaces/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatVoiceService {

  private endpointUrl = '/chat-voice';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }
  
  sendVoiceAndReceiveText(contextId: string, audioBlob: Blob): Observable<Message> {
    const formData: FormData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("context_id", contextId);
    // formData.append('file', audioFile, audioFile.name);
    return this.apiHttpService.postFile(
      `${this.endpointUrl}/${contextId}/text`,
      formData
    )
  }

  sendVoiceAndReceiveVoice(contextId: string, audioBlob: Blob): Observable<Message> {
    const formData: FormData = new FormData();
    formData.append("audio", audioBlob, "audio.wav");
    formData.append("context_id", contextId);
    // formData.append('file', audioFile, audioFile.name);
    return this.apiHttpService.postFile(
      `${this.endpointUrl}/${contextId}/voice`,
      formData
    )
  }

}
