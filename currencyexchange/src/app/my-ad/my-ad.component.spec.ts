import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdComponent } from './my-ad.component';

describe('MyAdComponent', () => {
  let component: MyAdComponent;
  let fixture: ComponentFixture<MyAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
