import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisingComponent } from './advertising.component';

describe('AdvertisingComponent', () => {
  let component: AdvertisingComponent;
  let fixture: ComponentFixture<AdvertisingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvertisingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvertisingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
