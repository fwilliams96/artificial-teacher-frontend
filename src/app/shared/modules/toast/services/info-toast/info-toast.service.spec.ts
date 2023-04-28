import { TestBed } from '@angular/core/testing';

import { InfoToastService } from './info-toast.service';

describe('InfoToastService', () => {
  let service: InfoToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
