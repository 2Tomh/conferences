import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementEmailComponent } from './announcement-email.component';

describe('AnnouncementEmailComponent', () => {
  let component: AnnouncementEmailComponent;
  let fixture: ComponentFixture<AnnouncementEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnouncementEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnouncementEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
