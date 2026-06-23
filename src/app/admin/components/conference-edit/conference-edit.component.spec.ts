import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConferenceEditComponent } from './conference-edit.component';

describe('ConferenceEditComponent', () => {
  let component: ConferenceEditComponent;
  let fixture: ComponentFixture<ConferenceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConferenceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConferenceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
