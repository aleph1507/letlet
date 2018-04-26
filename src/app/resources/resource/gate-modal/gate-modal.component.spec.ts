import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GateModalComponent } from './gate-modal.component';

describe('GateModalComponent', () => {
  let component: GateModalComponent;
  let fixture: ComponentFixture<GateModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GateModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GateModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
