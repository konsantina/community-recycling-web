import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEditReward } from './admin-edit-reward';

describe('AdminEditReward', () => {
  let component: AdminEditReward;
  let fixture: ComponentFixture<AdminEditReward>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEditReward]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEditReward);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
