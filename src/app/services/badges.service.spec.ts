import { TestBed, inject } from '@angular/core/testing';

import { BagdesService } from './bagdes.service';

describe('BagdesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BagdesService]
    });
  });

  it('should be created', inject([BagdesService], (service: BagdesService) => {
    expect(service).toBeTruthy();
  }));
});
