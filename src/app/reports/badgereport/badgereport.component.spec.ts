import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgereportComponent } from './badgereport.component';

describe('BadgereportComponent', () => {
  let component: BadgereportComponent;
  let fixture: ComponentFixture<BadgereportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgereportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
