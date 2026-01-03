import { TestBed } from '@angular/core/testing';

import { Dropoff } from './dropoff';

describe('Dropoff', () => {
  let service: Dropoff;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dropoff);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
