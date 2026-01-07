import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRedemptionsComponent } from './my-redemptions';

describe('MyRedemptionsComponent', () => {
  let component: MyRedemptionsComponent;
  let fixture: ComponentFixture<MyRedemptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyRedemptionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyRedemptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
