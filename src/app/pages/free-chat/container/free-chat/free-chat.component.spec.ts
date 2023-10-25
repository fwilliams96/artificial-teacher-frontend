import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeChatComponent } from './free-chat.component';

describe('FreeChatComponent', () => {
  let component: FreeChatComponent;
  let fixture: ComponentFixture<FreeChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeChatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
