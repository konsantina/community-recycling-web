import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDropoffs } from './my-dropoffs';

describe('MyDropoffs', () => {
  let component: MyDropoffs;
  let fixture: ComponentFixture<MyDropoffs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDropoffs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDropoffs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
