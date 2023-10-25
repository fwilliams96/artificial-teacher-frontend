import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { WordSentence } from '../../interfaces/word-sentence';

@Injectable({
  providedIn: 'root'
})
export class MyCardsService {

  private endpointUrl = '/users/cards';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  getSentences(): Observable<WordSentence[]> {
    return this.apiHttpService.getAndReceiveJson<WordSentence[]>(
      this.endpointUrl
    )
  }

}
