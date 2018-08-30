import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BadgesConfirmShredComponent } from './badges-confirm-shred.component';

describe('BadgesConfirmShredComponent', () => {
  let component: BadgesConfirmShredComponent;
  let fixture: ComponentFixture<BadgesConfirmShredComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadgesConfirmShredComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgesConfirmShredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
