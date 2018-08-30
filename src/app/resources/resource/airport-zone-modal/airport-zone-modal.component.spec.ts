import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportZoneModalComponent } from './airport-zone-modal.component';

describe('AirportZoneModalComponent', () => {
  let component: AirportZoneModalComponent;
  let fixture: ComponentFixture<AirportZoneModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportZoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportZoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
