import { TestBed } from '@angular/core/testing';

import { MyCardsService } from './my-cards.service';

describe('MyCardsService', () => {
  let service: MyCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
