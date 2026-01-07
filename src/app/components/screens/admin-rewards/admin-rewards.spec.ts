import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRewards } from './admin-rewards';

describe('AdminRewards', () => {
  let component: AdminRewards;
  let fixture: ComponentFixture<AdminRewards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRewards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRewards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
