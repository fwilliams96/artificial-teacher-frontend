import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PronunciationComponent } from './pronunciation.component';

describe('PronunciationComponent', () => {
  let component: PronunciationComponent;
  let fixture: ComponentFixture<PronunciationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PronunciationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PronunciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
