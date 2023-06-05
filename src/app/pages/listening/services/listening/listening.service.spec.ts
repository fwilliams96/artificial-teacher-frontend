import { TestBed } from '@angular/core/testing';

import { ListeningService } from './listening.service';

describe('ChatService', () => {
  let service: ListeningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListeningService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
