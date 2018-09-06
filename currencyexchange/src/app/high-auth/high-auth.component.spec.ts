import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighAuthComponent } from './high-auth.component';

describe('HighAuthComponent', () => {
  let component: HighAuthComponent;
  let fixture: ComponentFixture<HighAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
