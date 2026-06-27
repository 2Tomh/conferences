import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceEventsComponent } from './conference-events.component';

describe('ConferenceEventsComponent', () => {
  let component: ConferenceEventsComponent;
  let fixture: ComponentFixture<ConferenceEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
