import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranzilaPaymentComponent } from './tranzila-payment.component';

describe('TranzilaPaymentComponent', () => {
  let component: TranzilaPaymentComponent;
  let fixture: ComponentFixture<TranzilaPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranzilaPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranzilaPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
