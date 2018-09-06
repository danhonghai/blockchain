import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailSellComponent } from './order-detail-sell.component';

describe('OrderDetailSellComponent', () => {
  let component: OrderDetailSellComponent;
  let fixture: ComponentFixture<OrderDetailSellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderDetailSellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailSellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
