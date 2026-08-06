import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountdownPopupComponent } from './countdown-popup.component';

describe('CountdownPopupComponent', () => {
  let component: CountdownPopupComponent;
  let fixture: ComponentFixture<CountdownPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountdownPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountdownPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
