import { TestBed } from '@angular/core/testing';
import { MyDropoffs } from '../components/screens/my-dropoffs/my-dropoffs';


describe('Dropoff', () => {
  let service: MyDropoffs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyDropoffs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
