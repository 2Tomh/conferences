import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPlenaryEventsComponent } from './admin-plenary-events.component';

describe('AdminPlenaryEventsComponent', () => {
  let component: AdminPlenaryEventsComponent;
  let fixture: ComponentFixture<AdminPlenaryEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPlenaryEventsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPlenaryEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
