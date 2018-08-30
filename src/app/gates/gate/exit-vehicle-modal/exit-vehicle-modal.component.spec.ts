import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitVehicleModalComponent } from './exit-vehicle-modal.component';

describe('ExitVehicleModalComponent', () => {
  let component: ExitVehicleModalComponent;
  let fixture: ComponentFixture<ExitVehicleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitVehicleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitVehicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
