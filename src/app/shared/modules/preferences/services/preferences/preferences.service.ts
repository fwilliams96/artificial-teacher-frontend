import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Preference } from '../../interfaces/preference';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  private endpointUrl = '/preferences';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  getPreferences(): Observable<Preference[]> {
    return this.apiHttpService.getAndReceiveJson<Preference[]>(
      this.endpointUrl
    )
  }
}
