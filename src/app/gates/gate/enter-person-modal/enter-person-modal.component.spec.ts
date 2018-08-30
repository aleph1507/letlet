import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterPersonModalComponent } from './enter-person-modal.component';

describe('EnterPersonModalComponent', () => {
  let component: EnterPersonModalComponent;
  let fixture: ComponentFixture<EnterPersonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterPersonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
