import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonReportComponent } from './person-report.component';

describe('PersonReportComponent', () => {
  let component: PersonReportComponent;
  let fixture: ComponentFixture<PersonReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
