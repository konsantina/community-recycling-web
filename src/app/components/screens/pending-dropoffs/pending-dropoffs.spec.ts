import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingDropoffsComponent } from './pending-dropoffs';

describe('PendingDropoffs', () => {
  let component: PendingDropoffsComponent;
  let fixture: ComponentFixture<PendingDropoffsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingDropoffsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingDropoffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
