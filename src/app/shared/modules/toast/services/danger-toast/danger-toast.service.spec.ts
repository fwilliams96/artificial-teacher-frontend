import { TestBed } from '@angular/core/testing';

import { DangerToastService } from './danger-toast.service';

describe('DangerToastService', () => {
  let service: DangerToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DangerToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
