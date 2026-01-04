import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDropoffs } from './pending-dropoffs';

describe('PendingDropoffs', () => {
  let component: PendingDropoffs;
  let fixture: ComponentFixture<PendingDropoffs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingDropoffs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDropoffs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
