import { TestBed, inject } from '@angular/core/testing';

import { StopListService } from './stop-list.service';

describe('StopListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StopListService]
    });
  });

  it('should be created', inject([StopListService], (service: StopListService) => {
    expect(service).toBeTruthy();
  }));
});
