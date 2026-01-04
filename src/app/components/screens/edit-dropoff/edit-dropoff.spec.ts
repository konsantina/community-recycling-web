import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDropoff } from './edit-dropoff';

describe('EditDropoff', () => {
  let component: EditDropoff;
  let fixture: ComponentFixture<EditDropoff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditDropoff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditDropoff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
