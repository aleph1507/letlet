import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleBadgesCreateComponent } from './vehicle-badges-create.component';

describe('VehicleBadgesCreateComponent', () => {
  let component: VehicleBadgesCreateComponent;
  let fixture: ComponentFixture<VehicleBadgesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleBadgesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleBadgesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
