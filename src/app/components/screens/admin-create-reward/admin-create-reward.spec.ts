import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCreateRewardComponent } from './admin-create-reward';

describe('AdminCreateRewardComponent', () => {
  let component: AdminCreateRewardComponent;
  let fixture: ComponentFixture<AdminCreateRewardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminCreateRewardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminCreateRewardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
