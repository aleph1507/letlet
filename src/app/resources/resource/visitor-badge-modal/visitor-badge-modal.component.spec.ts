import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorBadgeModalComponent } from './visitor-badge-modal.component';

describe('VisitorBadgeModalComponent', () => {
  let component: VisitorBadgeModalComponent;
  let fixture: ComponentFixture<VisitorBadgeModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitorBadgeModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorBadgeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
