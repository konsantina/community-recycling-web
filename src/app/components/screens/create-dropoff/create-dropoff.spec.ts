import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDropoff } from './create-dropoff';

describe('CreateDropoff', () => {
  let component: CreateDropoff;
  let fixture: ComponentFixture<CreateDropoff>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDropoff]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDropoff);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
