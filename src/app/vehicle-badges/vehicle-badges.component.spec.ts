import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBadgesComponent } from './vehicle-badges.component';

describe('VehicleBadgesComponent', () => {
  let component: VehicleBadgesComponent;
  let fixture: ComponentFixture<VehicleBadgesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleBadgesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBadgesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
