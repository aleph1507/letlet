import { TestBed, inject } from '@angular/core/testing';

import { RequesterService } from './requester.service';

describe('RequesterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequesterService]
    });
  });

  it('should be created', inject([RequesterService], (service: RequesterService) => {
    expect(service).toBeTruthy();
  }));
});
