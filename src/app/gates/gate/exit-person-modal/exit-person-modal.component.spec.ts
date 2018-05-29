import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitPersonModalComponent } from './exit-person-modal.component';

describe('ExitPersonModalComponent', () => {
  let component: ExitPersonModalComponent;
  let fixture: ComponentFixture<ExitPersonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitPersonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
