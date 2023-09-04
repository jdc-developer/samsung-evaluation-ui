import { TestBed } from '@angular/core/testing';

import { SamsungApiService } from './samsung-api.service';

describe('SamsungApiService', () => {
  let service: SamsungApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SamsungApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
