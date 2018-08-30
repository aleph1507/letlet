import { TestBed, inject } from '@angular/core/testing';

import { VehicleBadgesService } from './vehicle-badges.service';

describe('VehicleBadgesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VehicleBadgesService]
    });
  });

  it('should be created', inject([VehicleBadgesService], (service: VehicleBadgesService) => {
    expect(service).toBeTruthy();
  }));
});
