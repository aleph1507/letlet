import { TestBed, inject } from '@angular/core/testing';

import { VslService } from './vsl.service';

describe('VslService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VslService]
    });
  });

  it('should be created', inject([VslService], (service: VslService) => {
    expect(service).toBeTruthy();
  }));
});
