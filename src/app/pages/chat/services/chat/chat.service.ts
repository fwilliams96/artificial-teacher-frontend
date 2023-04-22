import { Injectable } from '@angular/core';
import { Context } from '../../interfaces/context';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private endpointUrl = '/chat';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  startConversation(context: Context): Observable<Context> {
    return this.apiHttpService.postWithoutSuccessEntity<Context>(
      this.endpointUrl,
      context
    )
  }
}
