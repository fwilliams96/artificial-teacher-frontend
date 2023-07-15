import { Injectable } from '@angular/core';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { UserPreference } from '../../interfaces/user-preference';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private endpointUrl = '/user-preferences';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  getUserPreferences(): Observable<UserPreference[]> {
    return this.apiHttpService.getAndReceiveJson<UserPreference[]>(
      this.endpointUrl
    )
  }

  addUserPreferences(userPreferences: UserPreference[]): Observable<UserPreference[]> {
    return this.apiHttpService.postJsonAndReceiveJson<UserPreference[], UserPreference[]>(
      this.endpointUrl,
      userPreferences
    );
  }
}
