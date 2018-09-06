import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPageComponent } from './no-page.component';

describe('NoPageComponent', () => {
  let component: NoPageComponent;
  let fixture: ComponentFixture<NoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
