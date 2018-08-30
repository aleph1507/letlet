import { TestBed, inject } from '@angular/core/testing';

import { GatesService } from './gates.service';

describe('GatesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GatesService]
    });
  });

  it('should be created', inject([GatesService], (service: GatesService) => {
    expect(service).toBeTruthy();
  }));
});
