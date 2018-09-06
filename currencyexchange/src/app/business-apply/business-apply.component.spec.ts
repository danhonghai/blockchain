import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessApplyComponent } from './business-apply.component';

describe('BusinessApplyComponent', () => {
  let component: BusinessApplyComponent;
  let fixture: ComponentFixture<BusinessApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
