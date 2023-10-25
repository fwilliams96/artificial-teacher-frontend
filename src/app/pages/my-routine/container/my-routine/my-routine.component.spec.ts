import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRoutineComponent } from './my-routine.component';

describe('MyRoutineComponent', () => {
  let component: MyRoutineComponent;
  let fixture: ComponentFixture<MyRoutineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyRoutineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRoutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
