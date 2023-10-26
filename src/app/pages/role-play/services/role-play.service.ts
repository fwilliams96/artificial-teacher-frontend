import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { HttpParams } from '@angular/common/http';
import { RolePlay, RolePlayType } from '../interfaces/role-play';
import { RolePlayMessage } from '../interfaces/role-play-message';

@Injectable({
  providedIn: 'root'
})
export class RolePlayService {

  private endpointUrl = '/role-play';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  createRolePlay(rolePlayType: RolePlayType): Observable<RolePlay> {
    return this.apiHttpService.postJsonAndReceiveJson<{}, RolePlay>(
      this.endpointUrl,
      {},
      new HttpParams().append('role_play_type', rolePlayType)
    );
  }

  recoverRolePlay(rolePlayId: string): Observable<RolePlay> {
    return this.apiHttpService.getAndReceiveJson<RolePlay>(
      `${this.endpointUrl}/${rolePlayId}`
    )
  }

  sendMessage(chatId: string, userMessage: RolePlayMessage, responseInSpeech = false): Observable<RolePlayMessage[]> {
    return this.apiHttpService.postJsonAndReceiveJson<RolePlayMessage, RolePlayMessage[]>(
      `${this.endpointUrl}/${chatId}`,
      userMessage,
      new HttpParams().append('response_in_speech', responseInSpeech)
    )
  }

}
