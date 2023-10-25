import { TestBed } from '@angular/core/testing';

import { FreeChatService } from './role-play.service';

describe('RolePlayService', () => {
  let service: FreeChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FreeChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
