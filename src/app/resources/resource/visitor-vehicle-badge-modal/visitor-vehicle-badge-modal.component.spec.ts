import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorVehicleBadgeModalComponent } from './visitor-vehicle-badge-modal.component';

describe('VisitorVehicleBadgeModalComponent', () => {
  let component: VisitorVehicleBadgeModalComponent;
  let fixture: ComponentFixture<VisitorVehicleBadgeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorVehicleBadgeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorVehicleBadgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
