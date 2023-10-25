import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WallOfFameComponent } from './wall-of-fame.component';

describe('WallOfFameComponent', () => {
  let component: WallOfFameComponent;
  let fixture: ComponentFixture<WallOfFameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WallOfFameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WallOfFameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
