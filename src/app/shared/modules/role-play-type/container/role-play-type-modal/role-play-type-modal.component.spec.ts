import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePlayTypeModalComponent } from './role-play-type-modal.component';

describe('RolePlayTypeModalComponent', () => {
  let component: RolePlayTypeModalComponent;
  let fixture: ComponentFixture<RolePlayTypeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RolePlayTypeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolePlayTypeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
