import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterVehicleModalComponent } from './enter-vehicle-modal.component';

describe('EnterVehicleModalComponent', () => {
  let component: EnterVehicleModalComponent;
  let fixture: ComponentFixture<EnterVehicleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterVehicleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
