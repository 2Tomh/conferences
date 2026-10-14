import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EveningInvitationsComponent } from './evening-invitations.component';

describe('EveningInvitationsComponent', () => {
  let component: EveningInvitationsComponent;
  let fixture: ComponentFixture<EveningInvitationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EveningInvitationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EveningInvitationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
