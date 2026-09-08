import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlenaryEventsComponent } from './plenary-events.component';

describe('PlenaryEventsComponent', () => {
  let component: PlenaryEventsComponent;
  let fixture: ComponentFixture<PlenaryEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlenaryEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlenaryEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
