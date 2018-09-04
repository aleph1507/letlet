import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclebadgereportComponent } from './vehiclebadgereport.component';

describe('VehiclebadgereportComponent', () => {
  let component: VehiclebadgereportComponent;
  let fixture: ComponentFixture<VehiclebadgereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclebadgereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclebadgereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
