import { TestBed } from '@angular/core/testing';

import { ChatVoiceService } from './chat-voice.service';

describe('ChatVoiceService', () => {
  let service: ChatVoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatVoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
