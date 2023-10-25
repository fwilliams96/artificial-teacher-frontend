import { TestBed } from '@angular/core/testing';

import { MyRoutineService } from './my-routine.service';

describe('MyRoutineService', () => {
  let service: MyRoutineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyRoutineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
