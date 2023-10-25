import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Pronunciation } from '../interfaces/pronunciation';
import { Observable } from 'rxjs';
import { UserSpeech } from '../interfaces/user-speech';

@Injectable({
  providedIn: 'root'
})
export class PronunciationService {

  private endpointUrl = '/user-pronunciations';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  createPronunciation(): Observable<Pronunciation> {
    // return of(this.getMockListening());
    return this.apiHttpService.postJsonAndReceiveJson<{}, Pronunciation>(
      this.endpointUrl,
      {}
    );
  }

  getPronunciation(id_listening: string): Observable<Pronunciation> {
    return this.apiHttpService.getAndReceiveJson<Pronunciation>(
      `${this.endpointUrl}/${id_listening}`
    );
  }

  finishPronunciation(pronunciation_id: string, userSpeech: UserSpeech): Observable<Pronunciation> {
    return this.apiHttpService.postJsonAndReceiveJson<UserSpeech, Pronunciation>(
      `${this.endpointUrl}/${pronunciation_id}/close`,
      userSpeech
    )
  }
}
