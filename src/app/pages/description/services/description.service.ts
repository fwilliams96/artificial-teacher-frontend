import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHttpService } from 'src/app/shared/services/api-http/api-http.service';
import { Description } from '../interfaces/description';
import { DescriptionSolution } from '../interfaces/description-solution';

@Injectable({
  providedIn: 'root'
})
export class DescriptionService {

  private endpointUrl = '/user-descriptions';

  constructor(
    private readonly apiHttpService: ApiHttpService
  ) { }

  createDescription(): Observable<Description> {
    return this.apiHttpService.postJsonAndReceiveJson<{}, Description>(
      this.endpointUrl,
      {}
    );
  }

  getDescription(id_description: string): Observable<Description> {
    return this.apiHttpService.getAndReceiveJson<Description>(
      `${this.endpointUrl}/${id_description}`
    );
  }

  deliverDescription(id_description: string, userSolution: DescriptionSolution): Observable<Description> {
    return this.apiHttpService.postJsonAndReceiveJson<DescriptionSolution, Description>(
      `${this.endpointUrl}/${id_description}/close`,
      userSolution
    );
  }
  
}
