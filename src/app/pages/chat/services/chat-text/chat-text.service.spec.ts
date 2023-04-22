import { TestBed } from '@angular/core/testing';

import { ChatTextService } from './chat-text.service';

describe('ChatService', () => {
  let service: ChatTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
