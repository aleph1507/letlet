import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupationModalComponent } from './occupation-modal.component';

describe('OccupationModalComponent', () => {
  let component: OccupationModalComponent;
  let fixture: ComponentFixture<OccupationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
