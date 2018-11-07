import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsReportComponent } from './requests-report.component';

describe('RequestsReportComponent', () => {
  let component: RequestsReportComponent;
  let fixture: ComponentFixture<RequestsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
