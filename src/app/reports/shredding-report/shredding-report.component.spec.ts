import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShreddingReportComponent } from './shredding-report.component';

describe('ShreddingReportComponent', () => {
  let component: ShreddingReportComponent;
  let fixture: ComponentFixture<ShreddingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShreddingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShreddingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
