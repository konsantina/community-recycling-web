import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRedemptionsComponent } from './admin-redemptions';

describe('AdminRedemptions', () => {
  let component: AdminRedemptionsComponent;
  let fixture: ComponentFixture<AdminRedemptionsComponent>;   
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRedemptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRedemptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
