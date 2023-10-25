import { TestBed } from '@angular/core/testing';

import { FreeChatService } from './free-chat.service';

describe('FreeChatService', () => {
  let service: FreeChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
