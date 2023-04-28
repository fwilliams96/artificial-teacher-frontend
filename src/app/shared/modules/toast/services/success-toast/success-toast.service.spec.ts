import { TestBed } from '@angular/core/testing';

import { SuccessToastService } from './success-toast.service';

describe('SuccessToastService', () => {
  let service: SuccessToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
