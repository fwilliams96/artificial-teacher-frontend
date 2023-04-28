import { TestBed } from '@angular/core/testing';

import { WarningToastService } from './warning-toast.service';

describe('WarningToastService', () => {
  let service: WarningToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarningToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
